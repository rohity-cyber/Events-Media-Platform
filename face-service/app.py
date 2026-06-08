from flask import Flask, request, jsonify
from deepface import DeepFace
import requests
import tempfile
import os

app = Flask(__name__)

# ✅ FIX 3: Pre-warm the model at startup so it doesn't download mid-request
def warmup():
    try:
        DeepFace.build_model("Facenet512")
        print("Facenet512 model warmed up successfully")
    except Exception as e:
        print(f"Warmup warning: {e}")

warmup()  # runs once when gunicorn boots the worker

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

def download_image(url):
    response = requests.get(url, timeout=30)
    response.raise_for_status()  # ✅ FIX: catch bad URLs early
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    temp_file.write(response.content)
    temp_file.close()
    return temp_file.name

@app.route("/match", methods=["POST"])
def match_faces():
    reference_file = None
    target_file = None
    try:
        data = request.get_json()
        reference_image = data.get("referenceImage")
        target_image = data.get("targetImage")

        if not reference_image or not target_image:
            return jsonify({"error": "Both images are required"}), 400

        reference_file = download_image(reference_image)
        target_file = download_image(target_image)

        result = DeepFace.verify(
            img1_path=reference_file,
            img2_path=target_file,
            model_name="Facenet512",
            enforce_detection=False  # ✅ FIX 1: don't crash on hard-to-detect faces
        )

        distance = float(result["distance"])
        match = distance < 0.57

        return jsonify({"match": match, "distance": distance})

    except Exception as error:
        return jsonify({"match": False, "error": str(error)}), 200

    finally:
        for f in [reference_file, target_file]:
            if f and os.path.exists(f):
                os.remove(f)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)