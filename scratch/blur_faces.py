import os
import cv2
import numpy as np

folder_path = r"e:\descan\public\foto-kegiatan"
files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpeg', '.jpg', '.png'))]
files.sort(key=lambda x: int(os.path.splitext(x)[0]) if os.path.splitext(x)[0].isdigit() else x)

print(f"Found {len(files)} files to process in {folder_path}")

# Load Haar Cascades
cascade_files = [
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml',
    cv2.data.haarcascades + 'haarcascade_frontalface_alt.xml',
    cv2.data.haarcascades + 'haarcascade_frontalface_alt2.xml',
    cv2.data.haarcascades + 'haarcascade_profileface.xml'
]

cascades = [cv2.CascadeClassifier(cf) for cf in cascade_files]

def blur_face_region(img, x, y, w, h):
    h_img, w_img = img.shape[:2]
    # Add margin
    pad_w = int(w * 0.2)
    pad_h = int(h * 0.2)
    
    x1 = max(0, x - pad_w)
    y1 = max(0, y - pad_h)
    x2 = min(w_img, x + w + pad_w)
    y2 = min(h_img, y + h + pad_h)
    
    sub_face = img[y1:y2, x1:x2]
    if sub_face.size == 0:
        return
    
    # Heavy Gaussian Blur
    ksize_w = (x2 - x1) // 3 | 1
    ksize_h = (y2 - y1) // 3 | 1
    ksize = (max(15, ksize_w), max(15, ksize_h))
    
    blurred = cv2.GaussianBlur(sub_face, ksize, 30)
    img[y1:y2, x1:x2] = blurred

total_faces_blurred = 0

for file in files:
    file_path = os.path.join(folder_path, file)
    img = cv2.imread(file_path)
    if img is None:
        continue
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)
    
    all_faces = []
    for cascade in cascades:
        faces = cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(20, 20))
        for f in faces:
            all_faces.append(tuple(f))
            
    # Deduplicate overlapping faces
    if len(all_faces) > 0:
        rects, _ = cv2.groupRectangles(all_faces + all_faces, groupThreshold=1, eps=0.3)
    else:
        rects = []
        
    print(f"Image {file}: detected {len(rects)} face(s)")
    for (x, y, w, h) in rects:
        blur_face_region(img, x, y, w, h)
        total_faces_blurred += 1
        
    cv2.imwrite(file_path, img)

print(f"Successfully processed {len(files)} images, blurred {total_faces_blurred} faces total!")
