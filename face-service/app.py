import os
import cv2
import numpy as np
import requests
import tempfile
import onnxruntime as ort
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

SFACE_PATH = "/opt/render/.deepface/weights/face_recognition_sface_2021dec.onnx"
SFACE_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"

ort_session = None
face_cascade = None


def download_model(url, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not os.path.exists(path) or os.path.getsize(path) < 1000:
        print(f"Downloading {os.path.basename(path)}...")
        r = requests.get(url, timeout=60)
        r.raise_for_status()
        with open(path, "wb") as f:
            f.write(r.content)
        print(f"Downloaded {os.path.basename(path)} ({os.path.getsize(path)} bytes)")


def load_models():
    global ort_session, face_cascade

    download_model(SFACE_URL, SFACE_PATH)
    ort_session = ort.InferenceSession(
        SFACE_PATH,
        providers=["CPUExecutionProvider"],
        sess_options=ort.SessionOptions()
    )

    # Haar cascade ships with opencv — no download, no ONNX, no threads
    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    face_cascade = cv2.CascadeClassifier(cascade_path)
    if face_cascade.empty():
        raise RuntimeError("Failed to load Haar cascade")

    print("Models ready")


load_models()


def download_image(url):
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    tmp.write(response.content)
    tmp.close()
    return tmp.name


def read_image(path):
    img = cv2.imread(path)
    if img is None:
        pil = Image.open(path).convert("RGB")
        img = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
    return img


def get_embedding(image_path):
    img = read_image(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30)
    )

    if len(faces) > 0:
        # pick largest face
        x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
        # add 20% padding
        pad = int(0.2 * min(w, h))
        x1 = max(0, x - pad)
        y1 = max(0, y - pad)
        x2 = min(img.shape[1], x + w + pad)
        y2 = min(img.shape[0], y + h + pad)
        face_crop = img[y1:y2, x1:x2]
    else:
        face_crop = img

    face_resized = cv2.resize(face_crop, (112, 112))
    face_rgb = cv2.cvtColor(face_resized, cv2.COLOR_BGR2RGB)
    face_norm = (face_rgb.astype(np.float32) - 127.5) / 127.5
    face_input = np.transpose(face_norm, (2, 0, 1))[np.newaxis, :]

    input_name = ort_session.get_inputs()[0].name
    embedding = ort_session.run(None, {input_name: face_input})[0][0]
    return embedding


def cosine_similarity(a, b):
    a = a / (np.linalg.norm(a) + 1e-10)
    b = b / (np.linalg.norm(b) + 1e-10)
    return float(np.dot(a, b))


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

        emb1 = get_embedding(ref_file)
        emb2 = get_embedding(target_file)

        score = cosine_similarity(emb1, emb2)
        match = bool(score >= 0.30)

        return jsonify({"match": match, "score": score})

    except Exception as e:
        return jsonify({"match": False, "error": str(e)}), 200

    finally:
        for f in [ref_file, target_file]:
            if f and os.path.exists(f):
                os.remove(f)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)