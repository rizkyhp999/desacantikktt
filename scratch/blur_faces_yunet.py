import os
import cv2
import numpy as np

folder_path = r"e:\descan\public\foto-kegiatan"
model_path = r"e:\descan\scratch\face_detection_yunet_2023mar.onnx"

files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpeg', '.jpg', '.png'))]
files.sort(key=lambda x: int(os.path.splitext(x)[0]) if os.path.splitext(x)[0].isdigit() else x)

print(f"Found {len(files)} files to process in {folder_path}")

def blur_face_box(img, x, y, w, h):
    img_h, img_w = img.shape[:2]
    
    # Add generous padding to cover hair and chin completely
    pad_w = int(w * 0.35)
    pad_h = int(h * 0.35)
    
    x1 = max(0, int(x - pad_w))
    y1 = max(0, int(y - pad_h))
    x2 = min(img_w, int(x + w + pad_w))
    y2 = min(img_h, int(y + h + pad_h))
    
    sub_face = img[y1:y2, x1:x2]
    if sub_face.size == 0:
        return
    
    # Apply strong Gaussian Blur + Mosaic / Pixelation for absolute privacy
    box_w = x2 - x1
    box_h = y2 - y1
    
    # 1. Pixelate (downscale to tiny, upscale back)
    tiny = cv2.resize(sub_face, (max(4, box_w // 16), max(4, box_h // 16)), interpolation=cv2.INTER_LINEAR)
    pixelated = cv2.resize(tiny, (box_w, box_h), interpolation=cv2.INTER_NEAREST)
    
    # 2. Heavy Gaussian blur on top of pixelation
    kw = (box_w // 2) | 1
    kh = (box_h // 2) | 1
    blurred = cv2.GaussianBlur(pixelated, (max(21, kw), max(21, kh)), 0)
    
    img[y1:y2, x1:x2] = blurred

total_faces = 0

for file in files:
    file_path = os.path.join(folder_path, file)
    img = cv2.imread(file_path)
    if img is None:
        continue
    
    h, w = img.shape[:2]
    detector = cv2.FaceDetectorYN.create(
        model_path,
        "",
        (w, h),
        score_threshold=0.35,
        nms_threshold=0.3,
        top_k=5000
    )
    
    _, faces = detector.detect(img)
    
    num_detected = 0
    if faces is not None:
        num_detected = len(faces)
        for face in faces:
            fx, fy, fw, fh = face[0:4]
            blur_face_box(img, fx, fy, fw, fh)
            total_faces += 1
            
    print(f"Image {file}: blurred {num_detected} face(s)")
    cv2.imwrite(file_path, img)

print(f"\nFINISHED! Processed {len(files)} images and blurred a total of {total_faces} faces!")
