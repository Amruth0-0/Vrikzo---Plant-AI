import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import json
import sys
import os

def parse_class_name(class_name):
    """
    Extract plant name and condition from class name
    Examples:
    - "Aloe_Healthy" -> ("Aloe Vera", "Healthy")
    - "Tomato___Early_blight" -> ("Tomato", "Early Blight")
    - "hibiscus_death_leaf" -> ("Hibiscus", "Death Leaf")
    """
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
    """Generate user-friendly message"""
    if condition.lower() == 'healthy':
        return f"This looks like a healthy {plant_name}"
    else:
        if confidence >= 85:
            return f"Your {plant_name} appears to have {condition}"
        elif confidence >= 70:
            return f"Your {plant_name} might have {condition}, but I'm not entirely sure"
        else:
            return f"I detected possible {condition} in your {plant_name}, but confidence is low. Consider getting a second opinion."


def test_single_image(image_path, model, class_names, IMG_SIZE):
    """Test a single image and return JSON result"""
    try:
        # Load and preprocess image
        img = image.load_img(image_path, target_size=IMG_SIZE)
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Make prediction
        predictions = model.predict(img_array, verbose=0)
        predicted_idx = np.argmax(predictions)
        confidence = float(np.max(predictions) * 100)
        
        # Get predicted class
        predicted_class = class_names[predicted_idx]
        plant_name, condition = parse_class_name(predicted_class)
        
        # Determine status
        if confidence >= 85:
            status = "✅ Confident"
        elif confidence >= 70:
            status = "⚠️ Moderate"
        else:
            status = "❌ Uncertain"
        
        # Generate message
        message = generate_message(plant_name, condition, confidence)
        
        return {
            "plant": plant_name,
            "disease": condition,
            "confidence": round(confidence, 1),
            "status": status,
            "message": message,
            "raw_class": predicted_class,
            "image": os.path.basename(image_path)
        }
        
    except Exception as e:
        return {
            "plant": "Unknown",
            "confidence": 0.0,
            "status": "❌ Error",
            "message": f"Error processing image: {str(e)}",
            "image": os.path.basename(image_path)
        }


def test_batch_images(test_folder, model, class_names, IMG_SIZE):
    """Test multiple images from a folder structure"""
    results = []
    
    if not os.path.exists(test_folder):
        print(json.dumps({
            "error": f"Test folder not found: {test_folder}"
        }, indent=2))
        return
    
    # Iterate through class folders
    for class_folder in os.listdir(test_folder):
        folder_path = os.path.join(test_folder, class_folder)
        if not os.path.isdir(folder_path):
            continue
        
        # Test images in this class folder
        image_count = 0
        for img_name in os.listdir(folder_path):
            if not img_name.lower().endswith(('.jpg', '.jpeg', '.png')):
                continue
            
            img_path = os.path.join(folder_path, img_name)
            result = test_single_image(img_path, model, class_names, IMG_SIZE)
            result['actual_class'] = class_folder
            result['correct'] = class_folder.lower() in result['raw_class'].lower()
            results.append(result)
            
            image_count += 1
            if image_count >= 5:  # Test only 5 images per class
                break
    
    return results


def calculate_accuracy(results):
    """Calculate accuracy from batch results"""
    if not results:
        return 0.0
    
    correct = sum(1 for r in results if r.get('correct', False))
    total = len(results)
    accuracy = (correct / total) * 100
    
    return {
        "correct": correct,
        "total": total,
        "accuracy": round(accuracy, 1)
    }


def main():
    print("="*70)
    print("🌿 VRIKZO MODEL TESTING")
    print("="*70)
    
    # Load model
    print("\n🔄 Loading model...")
    try:
        model = tf.keras.models.load_model("Vrikzo_model.h5")
        print("✅ Model loaded successfully")
    except Exception as e:
        print(json.dumps({
            "error": f"Failed to load model: {str(e)}"
        }, indent=2))
        return
    
    # Load class names
    print("🔄 Loading class names...")
    try:
        with open('class_names.json', 'r') as f:
            class_names = json.load(f)
        print(f"✅ Loaded {len(class_names)} classes")
    except Exception as e:
        print(json.dumps({
            "error": f"Failed to load class_names.json: {str(e)}"
        }, indent=2))
        return
    
    # Get image size from model
    IMG_SIZE = (model.input_shape[1], model.input_shape[2])
    print(f"📐 Image size: {IMG_SIZE}")
    
    # Check command line arguments
    if len(sys.argv) < 2:
        print("\n" + "="*70)
        print("USAGE:")
        print("="*70)
        print("\n1. Test single image:")
        print("   python test_model.py image.jpg")
        print("\n2. Test folder of images:")
        print("   python test_model.py /path/to/test/folder")
        print("\n3. Test with default paths:")
        print("   python test_model.py --auto")
        print("\n" + "="*70)
        return
    
    arg = sys.argv[1]
    
    # Auto mode - test common paths
    if arg == "--auto":
        print("\n🔄 Running automatic tests...")
        test_paths = [
           r"Z:/VrikZo/plant-care-fullstack/plant-disease-backend/ml_model/mini\Aloe_dataset/test",
           r"Z:/VrikZo/plant-care-fullstack/plant-disease-backend/ml_model/mini/hibiscus_dataset",
           r"Z:/VrikZo/plant-care-fullstack/plant-disease-backend/ml_model/mini/tomato_dataset/test"
        ]   
        all_results = []
        for path in test_paths:
            if os.path.exists(path):
                print(f"\n📂 Testing: {path}")
                results = test_batch_images(path, model, class_names, IMG_SIZE)
                all_results.extend(results)
        
        if all_results:
            accuracy = calculate_accuracy(all_results)
            
            output = {
                "summary": accuracy,
                "results": all_results
            }
            
            print("\n" + "="*70)
            print("📊 RESULTS")
            print("="*70)
            print(json.dumps(output, indent=2))
            
            # Save to file
            with open('test_results.json', 'w') as f:
                json.dump(output, f, indent=2)
            print(f"\n💾 Results saved to: test_results.json")
        
    # Single file mode
    elif os.path.isfile(arg):
        print(f"\n🔄 Testing single image: {arg}")
        result = test_single_image(arg, model, class_names, IMG_SIZE)
        
        print("\n" + "="*70)
        print("📊 RESULT")
        print("="*70)
        print(json.dumps(result, indent=2))
    
    # Folder mode
    elif os.path.isdir(arg):
        print(f"\n🔄 Testing folder: {arg}")
        results = test_batch_images(arg, model, class_names, IMG_SIZE)
        
        if results:
            accuracy = calculate_accuracy(results)
            
            output = {
                "summary": accuracy,
                "results": results
            }
            
            print("\n" + "="*70)
            print("📊 RESULTS")
            print("="*70)
            print(json.dumps(output, indent=2))
            
            # Save to file
            with open('test_results.json', 'w') as f:
                json.dump(output, f, indent=2)
            print(f"\n💾 Results saved to: test_results.json")
    
    else:
        print(json.dumps({
            "error": f"Path not found: {arg}"
        }, indent=2))
    
    print("\n" + "="*70)


if __name__ == "__main__":
    main()