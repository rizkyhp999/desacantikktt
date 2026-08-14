import os
import fitz # PyMuPDF

pdf_dir = os.path.join("public", "publikasi")
output_dir = os.path.join("public", "publikasi", "covers")
os.makedirs(output_dir, exist_ok=True)

files = [
    "Buong Baru Dalam Angka 2026.pdf",
    "Potensi Desa Buong Baru.pdf",
    "PROFIL DESA BUONG BARU 2026.pdf",
    "PROFIL DESA BUONG BARU 2025.pdf",
    "PROFIL DESA BUONG BARU 2024.pdf",
    "PROFIL DESA BUONG BARU 2023.pdf",
]

for filename in files:
    pdf_path = os.path.join(pdf_dir, filename)
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        continue
    
    doc = fitz.open(pdf_path)
    page = doc.load_page(0) # page 1 (cover)
    
    # Render page to image at high resolution (zoom x2 for 150 DPI)
    zoom = 2.0
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    
    cover_name = filename.rsplit(".", 1)[0] + ".png"
    cover_path = os.path.join(output_dir, cover_name)
    pix.save(cover_path)
    print(f"Generated cover: {cover_path} ({pix.width}x{pix.height} px)")

print("Done generating cover thumbnails!")
