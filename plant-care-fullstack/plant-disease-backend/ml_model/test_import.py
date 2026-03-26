import traceback

try:
    from tensorflow.keras.preprocessing import image
    print("OK")
except Exception as e:
    with open('error.log', 'w') as f:
        f.write(traceback.format_exc())
