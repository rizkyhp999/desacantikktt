import os
from PIL import Image

folder_path = r"e:\descan\public\foto-kegiatan"
files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpeg', '.jpg', '.png'))]

print(f"Starting compression for {len(files)} files in {folder_path}...")

total_orig_bytes = 0
total_new_bytes = 0

for file in files:
    file_path = os.path.join(folder_path, file)
    orig_size = os.path.getsize(file_path)
    total_orig_bytes += orig_size
    
    try:
        with Image.open(file_path) as img:
            # Convert RGBA/P to RGB if necessary
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
                
            # Resize if dimensions are larger than 1200px
            max_dim = 1200
            if img.width > max_dim or img.height > max_dim:
                img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                
            # Save compressed image
            img.save(file_path, "JPEG", quality=80, optimize=True)
            
            new_size = os.path.getsize(file_path)
            total_new_bytes += new_size
            print(f"Compressed {file}: {orig_size / 1024 / 1024:.2f} MB -> {new_size / 1024:.1f} KB")
    except Exception as e:
        print(f"Error compressing {file}: {e}")

print(f"\nCompression Complete!")
print(f"Original total size: {total_orig_bytes / 1024 / 1024:.2f} MB")
print(f"New compressed total size: {total_new_bytes / 1024 / 1024:.2f} MB")
print(f"Saved: {(total_orig_bytes - total_new_bytes) / 1024 / 1024:.2f} MB")
