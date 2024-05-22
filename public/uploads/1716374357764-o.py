import tensorflow as tf
from tensorflow.keras.models import load_model
import datetime
import easyocr
import cv2
import numpy as np
import re
import sys

# Change console encoding to UTF-8 to handle Unicode characters properly
sys.stdout.reconfigure(encoding='utf-8')

# Load model CNN
model_path = "models/keras_model.h5"
model = load_model(model_path)

# Initialize OCR reader with verbose=False
try:
    reader = easyocr.Reader(['en'], verbose=False)
except Exception as e:
    print(f"Error initializing EasyOCR: {e}")
    raise

def preprocess_image(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    enhanced = cv2.bilateralFilter(gray, 11, 17, 17)
    _, thresh = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh

def extract_month_and_year(text):
    pattern = re.compile(r'(\d{2})\s*[-*:/.\s\']?\s*(\d{2})$')
    match = pattern.search(text)
    if match:
        try:
            month = int(match.group(1))
            year = int(match.group(2))
            return month, year
        except ValueError:
            raise ValueError(f"Could not convert month and year to integer: {match.group(0)}")
    else:
        raise ValueError(f"Could not find month and year pattern in text: {text}")

def check_plate_status(plate_month, plate_year, image_path):
    current_date = datetime.datetime.now()
    plate_year += 2000  # Adjust the year to the correct format (assuming 2000s)

    plate_date = datetime.datetime(year=plate_year, month=plate_month, day=1)
    current_year_month = current_date.year * 12 + current_date.month
    plate_year_month = plate_year * 12 + plate_month

    violations = []

    if plate_year_month < current_year_month:
        # Save the image for reference
        save_image(image_path, "plat_expired.jpg")
        violations.append("Plat nomor sudah tidak berlaku.")
        return violations, "plat_expired.jpg"
    elif plate_year_month == current_year_month:
        save_image(image_path, "plat_hampir_habis.jpg")
        violations.append("Masa berlaku hampir habis, segera perpanjang.")
        return violations, "plat_hampir_habis.jpg"
    else:
        save_image(image_path, "plat_aktif.jpg")
        violations.append("Plat nomor masih berlaku.")
        return violations, "plat_aktif.jpg"

def save_image(image_path, filename):
    img = cv2.imread(image_path)
    if img is not None:
        cv2.imwrite(filename, img)
    else:
        print("Tidak dapat menyimpan gambar:", image_path)

def consolidate_ocr_results(results):
    text_lines = []
    for detection in results:
        text = detection[1].replace('|', 'I')  # Correct common OCR error
        text_lines.append(text)
    return ' '.join(text_lines)

def predict_plate_and_status(image_path):
    img = cv2.imread(image_path)
    if img is None:
        print("Gambar tidak dapat dibaca")
        return None, "Gambar tidak dapat dibaca"
    
    preprocessed_img = preprocess_image(img)
    if len(preprocessed_img.shape) == 2:
        preprocessed_img = cv2.cvtColor(preprocessed_img, cv2.COLOR_GRAY2RGB)
    
    img_array = cv2.resize(preprocessed_img, (224, 224))
    img_array = np.expand_dims(img_array, axis=0)
    
    prediction = model.predict(img_array)
    if prediction > 0.5:
        result = reader.readtext(preprocessed_img)
        
        # Print the OCR results for debugging
        print("Hasil deteksi OCR:")
        for detection in result:
            print(detection)

        all_text = consolidate_ocr_results(result)
        
        try:
            month, year = extract_month_and_year(all_text)
            # Always print extracted month and year
            print("Bulan:", month)
            print("Tahun:", year)
            status, violation_image = check_plate_status(month, year, image_path)
            violation_message = status[0] if status else None
            
            if violation_message:
                print("Pelanggaran:", violation_message)
                if not isinstance(violation_message, list):
                    violation_message = [violation_message]  # Ubah ke dalam list untuk memudahkan penanganan

                violation_message = violation_message[0]  # Ambil string pertama dari list
                if "Plat nomor masih berlaku." in violation_message:
                    violation_color = (0, 255, 0)  # Green color
                else:
                    violation_color = (0, 0, 255)  # Red color

                # Load the violation image
                violation_img = cv2.imread(violation_image)
                if violation_img is not None:
                    # Add text to the violation image
                    violation_img_with_text = add_text_to_image(violation_img, violation_message, (10, 30), color=violation_color)
                    
                    # Resize the image for better visibility
                    resized_violation_img = resize_image(violation_img_with_text, 800, 600)
                    
                    # Show the image
                    cv2.imshow('Violation Image', resized_violation_img)
                    cv2.waitKey(0)
                    cv2.destroyAllWindows()
                else:
                    print("Tidak dapat memuat gambar pelanggaran:", violation_image)
            else:
                print("Tidak ada pesan pelanggaran")

            return all_text, status
        except ValueError as e:
            print("Error extracting month and year:", str(e))
            return None, str(e)
        
    else:
        print("Hasil prediksi model tidak valid")
        return None, "tidak berlaku"

def add_text_to_image(image, text, org, color=(255, 0, 0)):
    # Font settings
    font = cv2.FONT_HERSHEY_SIMPLEX 
    fontScale = 0.5
    thickness = 2

    # Adding text to the image
    image_with_text = cv2.putText(image, text, org, font, fontScale, color, thickness, cv2.LINE_AA) 

    return image_with_text

def resize_image(image, width, height):
    return cv2.resize(image, (width, height))

image_path = 'coba10.jpg'
plate_info, plate_status = predict_plate_and_status(image_path)
if plate_info:
    print("Informasi Plat Nomor:", plate_info)
    if plate_status:
        violation_message = plate_status[0][0] if plate_status[0] else None
        if violation_message:
            print("Pelanggaran:", violation_message)
            if not isinstance(violation_message, list):
                violation_message = [violation_message]  # Ubah ke dalam list untuk memudahkan penanganan

            violation_message = violation_message[0]  # Ambil string pertama dari list
            if "Plat nomor masih berlaku." in violation_message:
                violation_color = (0, 255, 0)  # Green color
            else:
                violation_color = (0, 0, 255)  # Red color

            # Add text to the violation image
            violation_image = plate_status[1] if len(plate_status) > 1 else None
            if violation_image:
                violation_img = cv2.imread(violation_image)
                if violation_img is not None:
                    violation_img_with_text = add_text_to_image(violation_img, violation_message, (10, 30), color=violation_color)

                    # Resize the image for better visibility
                    resized_violation_img = resize_image(violation_img_with_text, 800, 600)

                    # Show the image
                    cv2.imshow('Violation Image', resized_violation_img)
                    cv2.waitKey(0)
                    cv2.destroyAllWindows()
                else:
                    print("Tidak dapat memuat gambar pelanggaran:", violation_image)
            else:
                print("Foto pelanggaran tidak tersedia")
        else:
            print("Tidak ada pesan pelanggaran")
    else:
        print("Status plat nomor tidak tersedia")
else:
    print("Plat nomor tidak terdeteksi atau tidak berlaku")