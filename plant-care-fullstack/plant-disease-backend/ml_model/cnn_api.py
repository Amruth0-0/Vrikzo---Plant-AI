import io
import os
import json
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from flask import Flask, request, jsonify
from flask_cors import CORS

# -----------------------------
# Load Model + Class Names
# -----------------------------
MODEL_PATH = "Vrikzo_model.keras"
CLASS_PATH = "class_names.json"

try:
    print("[MODEL] Loading CNN model...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✔ Model Loaded")
except Exception as e:
    print("❌ Failed to load model:", e)
    raise e

try:
    with open(CLASS_PATH, "r") as f:
        class_names = json.load(f)
    print(f"✔ Loaded {len(class_names)} class names")
except Exception as e:
    print("❌ Failed loading class_names.json:", e)
    raise e

IMG_SIZE = (model.input_shape[1], model.input_shape[2])


# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------
# Map of known plant name prefixes to display names.
# Add new plants here when the model is retrained.
PLANT_NAME_MAP = {
    "aloe": "Aloe Vera",
    "tomato": "Tomato",
    "hibiscus": "Hibiscus",
}

def parse_class_name(class_name):
    """Convert a raw class label like 'Tomato___Early_blight' into
    a (plant_name, condition) tuple for human-readable display."""
    class_name = class_name.replace('___', '_').replace('__', '_')
    parts = class_name.split('_')

    plant_name = PLANT_NAME_MAP.get(parts[0].lower(), parts[0].title())
    condition_parts = parts[1:]
    condition = ' '.join(word.title() for word in condition_parts)
    return plant_name, condition


def generate_message(plant_name, condition, confidence):
    """Build a human-readable diagnosis message based on confidence."""
    if condition.lower() == 'healthy':
        return f"This looks like a healthy {plant_name}."
    if confidence >= 85:
        return f"Your {plant_name} appears to have {condition}."
    if confidence >= 70:
        return f"Your {plant_name} might have {condition}, but I'm not entirely sure."
    return f"I detected possible {condition} in your {plant_name}, but confidence is low."


def run_inference(file_bytes):
    """Run real CNN model inference on image bytes and return a
    structured result dict. Raises on preprocessing or model errors."""
    img = image.load_img(io.BytesIO(file_bytes), target_size=IMG_SIZE)
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array, verbose=0)
    idx = int(np.argmax(predictions[0]))
    confidence = round(float(predictions[0][idx]) * 100, 2)

    raw_class = class_names[idx]
    plant_name, condition = parse_class_name(raw_class)
    message = generate_message(plant_name, condition, confidence)

    return {
        "plant": plant_name,
        "condition": condition,
        "confidence": confidence,
        "message": message,
        "raw_class": raw_class,
    }


# -----------------------------
# Flask API
# -----------------------------
app = Flask(__name__)
CORS(app)

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # Basic MIME type guard (Flask side)
    if file.content_type and file.content_type not in ALLOWED_MIME_TYPES:
        return jsonify({"error": f"Unsupported file type: {file.content_type}"}), 415

    try:
        file_bytes = file.read()

        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            return jsonify({"error": "File too large. Maximum size is 5 MB."}), 413

        result = run_inference(file_bytes)
        return jsonify(result)

    except Exception as e:
        print(f"❌ Inference error: {e}")
        return jsonify({"error": "Model inference failed. Please try a clearer image."}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model": MODEL_PATH,
        "classes": len(class_names),
        "img_size": IMG_SIZE,
    })


if __name__ == "__main__":
    print("Starting CNN API on http://127.0.0.1:8000")
    app.run(host="0.0.0.0", port=8000, debug=True)
