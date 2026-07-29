
from PIL import Image
import os

img = Image.open(r"E:\\descan\\public\\foto-kegiatan\\hero.JPG")
img.save(r"E:\\descan\\public\\foto-kegiatan\\hero_min.jpg", "JPEG", quality=75, optimize=True)
size = os.path.getsize(r"E:\\descan\\public\\foto-kegiatan\\hero_min.jpg")
print(f"Compressed size: {size / (1024*1024):.2f} MB")
