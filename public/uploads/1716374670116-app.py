import os
from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import datetime
import easyocr
import re
from tensorflow.keras.models import load_model

# Load model CNN
model_path = "models/keras_model.h5"
model = load_model(model_path)

# Initialize OCR reader with verbose=False
try:
    reader = easyocr.Reader(["en"], verbose=False)
except Exception as e:
    print(f"Error initializing EasyOCR: {e}")
    raise

app = Flask(__name__)


def preprocess_image(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    enhanced = cv2.bilateralFilter(gray, 11, 17, 17)
    _, thresh = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh


def extract_month_and_year(text):
    pattern = re.compile(r"(\d{2})\s*[-*:/.\s\']?\s*(\d{2})$")
    match = pattern.search(text)
    if match:
        try:
            month = int(match.group(1))
            year = int(match.group(2))
            return month, year
        except ValueError:
            raise ValueError(
                f"Could not convert month and year to integer: {match.group(0)}"
            )
    else:
        raise ValueError(f"Could not find month and year pattern in text: {text}")


def check_plate_status(plate_month, plate_year):
    current_date = datetime.datetime.now()
    plate_year += 2000  # Adjust the year to the correct format (assuming 2000s)

    plate_date = datetime.datetime(year=plate_year, month=plate_month, day=1)
    current_year_month = current_date.year * 12 + current_date.month
    plate_year_month = plate_year * 12 + plate_month

    if plate_year_month < current_year_month:
        return "Plat nomor sudah tidak berlaku."
    elif plate_year_month == current_year_month:
        return "Masa berlaku hampir habis, segera perpanjang."
    else:
        return "Plat nomor masih berlaku."


def consolidate_ocr_results(results):
    text_lines = []
    for detection in results:
        text = detection[1].replace("|", "I")  # Correct common OCR error
        text_lines.append(text)
    return " ".join(text_lines)


def add_text_to_image(image, text, org, color=(255, 0, 0)):
    # Font settings
    font = cv2.FONT_HERSHEY_SIMPLEX
    fontScale = 0.5
    thickness = 2

    # Adding text to the image
    image_with_text = cv2.putText(
        image, text, org, font, fontScale, color, thickness, cv2.LINE_AA
    )
    return image_with_text


def resize_image(image, width, height):
    return cv2.resize(image, (width, height))


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"})

    # Simpan sementara file dan lakukan deteksi plat nomor
    temp_path = "temp.jpg"
    file.save(temp_path)

    # Lakukan proses deteksi plat nomor
    img = cv2.imread(temp_path)
    preprocessed_img = preprocess_image(img)
    if len(preprocessed_img.shape) == 2:
        preprocessed_img = cv2.cvtColor(preprocessed_img, cv2.COLOR_GRAY2RGB)

    img_array = cv2.resize(preprocessed_img, (224, 224))
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)[0][0]
    prediction_percentage = f"Confidence: {prediction * 100:.2f}%"

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
            violation_message = check_plate_status(month, year)

            # Tambahkan teks hasil deteksi, pelanggaran, dan persentase ke gambar
            image_with_text = add_text_to_image(img, all_text, (10, 30))
            image_with_violation = add_text_to_image(
                image_with_text, violation_message, (10, 60)
            )
            image_with_percentage = add_text_to_image(
                image_with_violation, prediction_percentage, (10, 90)
            )

            # Resize gambar untuk tampilan yang lebih baik
            resized_image = resize_image(image_with_percentage, 800, 600)

            # Simpan gambar hasil dengan teks, pelanggaran, dan persentase
            result_path = (
                f"static/result_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.jpg"
            )
            cv2.imwrite(result_path, resized_image)

            return jsonify(
                {
                    "plate_info": all_text,
                    "plate_status": violation_message,
                    "prediction_percentage": prediction_percentage,
                    "result_image": result_path,
                }
            )
        except ValueError as e:
            print("Error extracting month and year:", str(e))
            return jsonify({"error": str(e)})

    else:
        return jsonify({"error": "Hasil prediksi model tidak valid"})


if __name__ == "__main__":
    # Create the static folder if it doesn't exist
    if not os.path.exists("static"):
        os.makedirs("static")

    app.run(debug=True)
