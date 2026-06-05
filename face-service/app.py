from flask import Flask, request, jsonify

from deepface import DeepFace

import requests
import tempfile
import os

app = Flask(__name__)


@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "ok"
    })


def download_image(url):

    response = requests.get(url)

    temp_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".jpg"
    )

    temp_file.write(
        response.content
    )

    temp_file.close()

    return temp_file.name


@app.route("/match", methods=["POST"])
def match_faces():

    reference_file = None
    target_file = None

    try:

        data = request.get_json()

        reference_image = data.get(
            "referenceImage"
        )

        target_image = data.get(
            "targetImage"
        )

        if (
            not reference_image
            or
            not target_image
        ):

            return jsonify({
                "error":
                "Both images are required"
            }), 400

        reference_file = download_image(
            reference_image
        )

        target_file = download_image(
            target_image
        )

        result = DeepFace.verify(

            img1_path=
            reference_file,

            img2_path=
            target_file,

            model_name=
            "Facenet512",

            enforce_detection=
            True

        )

        distance = float(
            result["distance"]
        )

        match = (
            distance < 0.57
        )

        return jsonify({

            "match":
            match,

            "distance":
            distance

        })

    except Exception as error:

        return jsonify({

            "match":
            False,

            "error":
            str(error)

        }), 200

    finally:

        if (
            reference_file
            and
            os.path.exists(
                reference_file
            )
        ):
            os.remove(
                reference_file
            )

        if (
            target_file
            and
            os.path.exists(
                target_file
            )
        ):
            os.remove(
                target_file
            )


if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=8000,

        debug=True

    )