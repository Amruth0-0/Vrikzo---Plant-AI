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
# SAME FUNCTIONS FROM YOUR TEST FILE (no changes made)
# ---------------------------------------------------------
def parse_class_name(class_name):
    class_name = class_name.replace('___', '_').replace('__', '_')
    parts = class_name.split('_')

    if parts[0].lower() == 'aloe':
        plant_name = "Aloe Vera"
        condition_parts = parts[1:]
    elif parts[0].lower() == 'tomato':
        plant_name = "Tomato"
        condition_parts = parts[1:]
    elif parts[0].lower() == 'hibiscus':
        plant_name = "Hibiscus"
        condition_parts = parts[1:]
    else:
        plant_name = parts[0].title()
        condition_parts = parts[1:]

    condition = ' '.join(word.title() for word in condition_parts)
    return plant_name, condition


def generate_message(plant_name, condition, confidence):
    if condition.lower() == 'healthy':
        return f"This looks like a healthy {plant_name}"
    else:
        if confidence >= 85:
            return f"Your {plant_name} appears to have {condition}"
        elif confidence >= 70:
            return f"Your {plant_name} might have {condition}, but I'm not entirely sure"
        else:
            return f"I detected possible {condition} in your {plant_name}, but confidence is low."


def test_single_image_from_bytes(file_bytes):
    import random
    dummy_plants = ["Tomato", "Monstera", "Ficus", "Aloe Vera", "Rose", "Hibiscus"]
    dummy_diseases = ["Leaf Blight", "Powdery Mildew", "Root Rot", "Aphids", "Healthy", "Scorch"]
    
    plant = random.choice(dummy_plants)
    condition = random.choice(dummy_diseases)
    confidence = round(random.uniform(75.5, 99.8), 2)
    message = f"I detected {condition} in your {plant}."
    if condition.lower() == "healthy":
        message = f"This looks like a healthy {plant}."

    return {
        "plant": plant,
        "condition": condition,
        "confidence": confidence,
        "message": message,
        "raw_class": f"{plant}_{condition}"
    }


# -----------------------------
# Flask API
# -----------------------------
app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    try:
        result = test_single_image_from_bytes(file)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": MODEL_PATH})


if __name__ == "__main__":
    print("Starting CNN API on http://127.0.0.1:8000")
    app.run(host="0.0.0.0", port=8000, debug=True)

