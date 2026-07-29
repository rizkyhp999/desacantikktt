
from PIL import Image
import os

img = Image.open(r"E:\\descan\\public\\foto-kegiatan\\hero.JPG")
img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
img.save(r"E:\\descan\\public\\foto-kegiatan\\hero_min.jpg", "JPEG", quality=78, optimize=True)

size_orig = os.path.getsize(r"E:\\descan\\public\\foto-kegiatan\\hero.JPG")
size_min = os.path.getsize(r"E:\\descan\\public\\foto-kegiatan\\hero_min.jpg")

print(f"Original: {size_orig / 1024:.1f} KB -> Compressed: {size_min / 1024:.1f} KB")
