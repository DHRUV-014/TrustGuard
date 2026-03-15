"""
Face Engine
===========
MediaPipe Tasks Face Detector (TFLite)
Stable face crops for UI + ML
"""

from __future__ import annotations
from typing import List, Dict, Optional
import os
import cv2
import numpy as np

from mediapipe import Image, ImageFormat
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.core import base_options


class FaceEngine:
    def __init__(self) -> None:
        BASE_DIR = os.path.dirname(os.path.dirname(__file__))
        model_path = os.path.join(BASE_DIR, "models", "face_detector.tflite")

        options = vision.FaceDetectorOptions(
            base_options=base_options.BaseOptions(model_asset_path=model_path),
            running_mode=vision.RunningMode.IMAGE,
            min_detection_confidence=0.6,
        )

        self.detector = vision.FaceDetector.create_from_options(options)

    # --------------------------------------------------
    # PUBLIC (bytes input for existing pipeline)
    # --------------------------------------------------
    def process_image(self, image_bytes: bytes) -> List[Dict[str, np.ndarray]]:
        image = self._bytes_to_bgr(image_bytes)
        if image is None:
            return []

        return self._extract_faces(image)

    # --------------------------------------------------
    # ✅ NEW PUBLIC METHOD (for challenge pipeline)
    # Accepts a BGR numpy frame directly
    # --------------------------------------------------
    def extract_face(self, frame: np.ndarray) -> Optional[np.ndarray]:
        """
        Returns first detected face crop (BGR).
        Returns None if no face detected.
        """
        faces = self._extract_faces(frame)

        if not faces:
            return None

        return faces[0]["face"]

    # --------------------------------------------------
    # CORE DETECTION
    # --------------------------------------------------
    def _extract_faces(self, image: np.ndarray) -> List[Dict[str, np.ndarray]]:
        h, w = image.shape[:2]

        mp_image = Image(
            image_format=ImageFormat.SRGB,
            data=cv2.cvtColor(image, cv2.COLOR_BGR2RGB),
        )

        result = self.detector.detect(mp_image)

        if not result.detections:
            return []

        faces = []

        for det in result.detections:
            box = det.bounding_box

            x1 = int(box.origin_x)
            y1 = int(box.origin_y)
            x2 = int(x1 + box.width)
            y2 = int(y1 + box.height)

            # Clamp to image bounds
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(w, x2), min(h, y2)

            face = image[y1:y2, x1:x2]
            if face.size == 0:
                continue

            faces.append({
                "full": face.copy(),
                "face": face.copy(),
                "model": cv2.resize(face, (224, 224))
            })

        return faces

    # --------------------------------------------------
    @staticmethod
    def _bytes_to_bgr(image_bytes: bytes):
        data = np.frombuffer(image_bytes, dtype=np.uint8)
        return cv2.imdecode(data, cv2.IMREAD_COLOR)