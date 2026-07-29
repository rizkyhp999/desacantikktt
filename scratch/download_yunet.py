import urllib.request
import os

model_url = "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"
save_path = r"e:\descan\scratch\face_detection_yunet_2023mar.onnx"

if not os.path.exists(save_path):
    print("Downloading YuNet face detection ONNX model...")
    urllib.request.urlretrieve(model_url, save_path)
    print("Model downloaded successfully!")
else:
    print("Model already exists locally!")
