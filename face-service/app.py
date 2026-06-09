import os
import cv2
import numpy as np
import requests
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

MODEL_PATH = "/opt/render/.deepface/weights/face_recognition_sface_2021dec.onnx"
DETECTOR_PATH = "/opt/render/.deepface/weights/face_detection_yunet_2023mar.onnx"
MODEL_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"
DETECTOR_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"

recognizer = None
detector = None


def download_model(url, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not os.path.exists(path):
        print(f"Downloading {os.path.basename(path)}...")
        r = requests.get(url, timeout=60)
        r.raise_for_status()
        with open(path, "wb") as f:
            f.write(r.content)
        print(f"Downloaded {os.path.basename(path)}")


def load_models():
    global recognizer, detector
    download_model(MODEL_URL, MODEL_PATH)
    download_model(DETECTOR_URL, DETECTOR_PATH)
    recognizer = cv2.FaceRecognizerSF.create(MODEL_PATH, "")
    detector = cv2.FaceDetectorYN.create(DETECTOR_PATH, "", (320, 320))
    print("Models ready")


load_models()


def download_image(url):
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    tmp.write(response.content)
    tmp.close()
    return tmp.name


def get_face_embedding(image_path):
    img = cv2.imread(image_path)
    if img is None:
        # try via PIL for unusual formats
        pil = Image.open(image_path).convert("RGB")
        img = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)

    h, w = img.shape[:2]
    detector.setInputSize((w, h))
    _, faces = detector.detect(img)

    if faces is None or len(faces) == 0:
        # fallback: use whole image resized as face
        face_img = cv2.resize(img, (112, 112))
    else:
        # use highest confidence face
        faces = sorted(faces, key=lambda x: x[-1], reverse=True)
        aligned = recognizer.alignCrop(img, faces[0])
        face_img = aligned

    embedding = recognizer.feature(face_img)
    return embedding


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/match", methods=["POST"])
def match_faces():
    ref_file = None
    target_file = None

    try:
        data = request.get_json()
        reference_image = data.get("referenceImage")
        target_image = data.get("targetImage")

        if not reference_image or not target_image:
            return jsonify({"error": "Both images are required"}), 400

        ref_file = download_image(reference_image)
        target_file = download_image(target_image)

        emb1 = get_face_embedding(ref_file)
        emb2 = get_face_embedding(target_file)

        score = recognizer.match(emb1, emb2, cv2.FaceRecognizerSF_FR_COSINE)
        # SFace cosine score: higher = more similar (opposite of distance)
        # threshold from opencv docs: 0.363 for same person
        match = bool(score >= 0.363)

        return jsonify({"match": match, "score": float(score)})

    except Exception as e:
        return jsonify({"match": False, "error": str(e)}), 200

    finally:
        for f in [ref_file, target_file]:
            if f and os.path.exists(f):
                os.remove(f)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)