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
YUNET_PATH = "/opt/render/.deepface/weights/face_detection_yunet_2023mar.onnx"
SFACE_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"
YUNET_URL = "https://huggingface.co/opencv/face_detection_yunet/resolve/main/face_detection_yunet_2023mar.onnx"

detector = None
ort_session = None


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
    global detector, ort_session
    download_model(SFACE_URL, SFACE_PATH)
    download_model(YUNET_URL, YUNET_PATH)

    # Use onnxruntime directly — avoids cv2.FaceRecognizerSF gevent bug in 4.13
    ort_session = ort.InferenceSession(SFACE_PATH, providers=["CPUExecutionProvider"])
    print("SFace ONNX session ready, inputs:", [i.name for i in ort_session.get_inputs()])

    detector = cv2.FaceDetectorYN.create(YUNET_PATH, "", (320, 320))
    print("YuNet detector ready")


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
    h, w = img.shape[:2]

    if h < 64 or w < 64:
        img = cv2.resize(img, (320, 320))
        h, w = 320, 320

    detector.setInputSize((w, h))
    _, faces = detector.detect(img)

    if faces is not None and len(faces) > 0:
        best = max(faces, key=lambda x: x[-1])
        x, y, fw, fh = int(best[0]), int(best[1]), int(best[2]), int(best[3])
        x, y = max(0, x), max(0, y)
        face_crop = img[y:y+fh, x:x+fw]
        if face_crop.size == 0:
            face_crop = img
    else:
        face_crop = img

    # Preprocess for SFace: resize to 112x112, normalize to [-1, 1]
    face_resized = cv2.resize(face_crop, (112, 112))
    face_rgb = cv2.cvtColor(face_resized, cv2.COLOR_BGR2RGB)
    face_norm = (face_rgb.astype(np.float32) - 127.5) / 127.5
    face_input = np.transpose(face_norm, (2, 0, 1))[np.newaxis, :]  # NCHW

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