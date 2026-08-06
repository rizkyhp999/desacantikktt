import sys

print("Python version:", sys.version)

try:
    import fitz # PyMuPDF
    print("fitz (PyMuPDF) is installed!")
except ImportError:
    print("fitz NOT installed")

try:
    from pdf2image import convert_from_path
    print("pdf2image is installed!")
except ImportError:
    print("pdf2image NOT installed")

try:
    import pypdfium2
    print("pypdfium2 is installed!")
except ImportError:
    print("pypdfium2 NOT installed")
