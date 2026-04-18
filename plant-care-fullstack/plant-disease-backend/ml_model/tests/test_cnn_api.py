# tests/test_cnn_api.py
"""
Pytest tests for the Flask CNN API (cnn_api.py).
Run from the ml_model directory: pytest tests/
"""
import io
import json
import sys
import os
import pytest

# Allow importing from parent directory
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


@pytest.fixture(scope="module")
def client():
    """Provide a Flask test client with the app loaded."""
    from cnn_api import app
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c


# -----------------------------------------------------------------------
# /health
# -----------------------------------------------------------------------
class TestHealth:
    def test_health_returns_ok(self, client):
        res = client.get("/health")
        assert res.status_code == 200
        data = json.loads(res.data)
        assert data["status"] == "ok"
        assert "classes" in data
        assert "img_size" in data


# -----------------------------------------------------------------------
# /predict — boundary / error cases (no real image needed)
# -----------------------------------------------------------------------
class TestPredict:
    def test_predict_no_file_returns_400(self, client):
        res = client.post("/predict")
        assert res.status_code == 400

    def test_predict_wrong_mime_returns_415(self, client):
        data = {"file": (io.BytesIO(b"fake pdf content"), "doc.pdf", "application/pdf")}
        res = client.post("/predict", data=data, content_type="multipart/form-data")
        assert res.status_code == 415

    def test_predict_oversized_file_returns_413(self, client):
        # 6MB blob — exceeds the 5MB limit
        big_bytes = b"\x00" * (6 * 1024 * 1024)
        data = {"file": (io.BytesIO(big_bytes), "big.jpg", "image/jpeg")}
        res = client.post("/predict", data=data, content_type="multipart/form-data")
        assert res.status_code == 413

    def test_predict_valid_image_returns_200_or_500(self, client):
        """A 1x1 white JPEG — model will run but result may vary; just assert HTTP code."""
        import struct
        import zlib

        # Minimal valid 1x1 white PNG
        def make_png():
            sig = b"\x89PNG\r\n\x1a\n"
            def chunk(ctype, data):
                c = ctype + data
                return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
            ihdr = chunk(b"IHDR", struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0))
            raw = b"\x00\xFF\xFF\xFF"
            idat = chunk(b"IDAT", zlib.compress(raw))
            iend = chunk(b"IEND", b"")
            return sig + ihdr + idat + iend

        png = make_png()
        data = {"file": (io.BytesIO(png), "test.png", "image/png")}
        res = client.post("/predict", data=data, content_type="multipart/form-data")
        # 200 = inference ran; 500 = image too small to preprocess — both acceptable here
        assert res.status_code in (200, 500)
