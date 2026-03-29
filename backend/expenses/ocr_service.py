import cv2
import pytesseract
import re
import os
import fitz  # PyMuPDF
from PIL import Image

# For Windows, point to the typical Tesseract UB-Mannheim installation path if not in env
tesseract_cmd_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
if os.path.exists(tesseract_cmd_path):
    pytesseract.pytesseract.tesseract_cmd = tesseract_cmd_path

def extract_receipt_data(file_path):
    """
    Extracts Amount, Date, and Vendor Name from receipt image or PDF using Tesseract OCR.
    """
    text = ""
    try:
        # Check if PDF
        if file_path.lower().endswith('.pdf'):
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text()
                # If the PDF is just a scanned image without a text layer, we need to rasterize it
                if len(text.strip()) < 10:
                    pix = page.get_pixmap(dpi=300)
                    img_data = pix.tobytes("png")
                    # Save to temp image
                    temp_img_path = file_path + "_temp.png"
                    with open(temp_img_path, "wb") as f:
                        f.write(img_data)
                    # Run OCR on the temp rasterized image
                    text += extract_text_from_image(temp_img_path)
                    os.remove(temp_img_path)
            doc.close()
        else:
            text = extract_text_from_image(file_path)
            
        print("OCR Extracted Text Logs:", text)

        # Basic parsing heuristics
        amount = None
        date = None
        vendor = None
        
        lines = text.split('\n')
        if lines:
            # Assume first non-empty line is vendor
            for line in lines:
                clean_line = line.strip()
                if clean_line and len(clean_line) > 3 and not re.search(r'\d', clean_line):
                    vendor = clean_line
                    break
        
        # RegExp for money patterns (e.g. 10.00, $5.50)
        amount_matches = re.findall(r'[\$£€₹]?\s*(\d+[,.]\d{2})', text)
        if amount_matches:
            # Convert comma to dot
            amounts_float = [float(a.replace(',', '.')) for a in amount_matches]
            # Usually the largest or last is the total. Let's pick the largest realistic one.
            amount = max(amounts_float) if amounts_float else None
            
        # RegExp for dates (e.g. 12/31/2023, 2023-12-31, 12-05-2024)
        date_matches = re.findall(r'(\d{2,4}[-/.]\d{1,2}[-/.]\d{1,4})', text)
        if date_matches:
            date = date_matches[0].replace('.', '-') # Normalize

        return {
            'vendor': vendor or "Unknown Vendor",
            'amount': amount or "0.00",
            'date': date or "",
            'raw_text': text
        }
            
    except Exception as e:
        print(f"OCR Error: {e}")
        return None

def extract_text_from_image(image_path):
    try:
        # Preprocessing with OpenCV
        img = cv2.imread(image_path)
        if img is None:
            # Fallback to pure Pillow if cv2 fails to read
            return pytesseract.image_to_string(Image.open(image_path))
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Apply thresholding
        _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
        
        custom_config = r'--oem 3 --psm 6'
        return pytesseract.image_to_string(thresh, config=custom_config)
    except Exception as e:
        print(f"Image Extraction Error: {e}")
        return ""
