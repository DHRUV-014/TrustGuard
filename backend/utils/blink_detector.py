import cv2
import numpy as np
import mediapipe as mp


class BlinkDetector:
    """
    Simple blink detector based on Eye Aspect Ratio (EAR) computed
    from MediaPipe FaceMesh landmarks.
    Falls back gracefully (no blinks) if FaceMesh is unavailable.
    """

    def __init__(self, ear_threshold: float = 0.21):
        self.ear_threshold = ear_threshold

        # Some Mediapipe builds (e.g., tasks-only) do not expose mp.solutions.
        # We must guard access to avoid AttributeError and keep the API alive.
        self._face_mesh = None
        self._left_eye_indices = []
        self._right_eye_indices = []

        try:
            mp_solutions = getattr(mp, "solutions", None)
            if mp_solutions is not None and hasattr(mp_solutions, "face_mesh"):
                mp_face_mesh = mp_solutions.face_mesh

                # Static images, BGR input, single face
                self._face_mesh = mp_face_mesh.FaceMesh(
                    static_image_mode=True,
                    max_num_faces=1,
                    refine_landmarks=True,
                    min_detection_confidence=0.5,
                )

                # Landmark indices for the eyes (MediaPipe FaceMesh)
                # Left eye
                self._left_eye_indices = [33, 160, 158, 133, 153, 144]
                # Right eye
                self._right_eye_indices = [263, 387, 385, 362, 380, 373]
        except Exception:
            # If anything goes wrong, we silently disable blink detection.
            self._face_mesh = None
            self._left_eye_indices = []
            self._right_eye_indices = []

    @staticmethod
    def _euclidean_dist(p1, p2):
        return np.linalg.norm(np.array(p1) - np.array(p2))

    def _eye_aspect_ratio(self, landmarks, indices, image_width, image_height):
        pts = []
        for idx in indices:
            lm = landmarks[idx]
            pts.append((lm.x * image_width, lm.y * image_height))

        # p1-p4: horizontal, p2-p6 & p3-p5: vertical pairs
        p1, p2, p3, p4, p5, p6 = pts

        vert_1 = self._euclidean_dist(p2, p6)
        vert_2 = self._euclidean_dist(p3, p5)
        horiz = self._euclidean_dist(p1, p4)

        if horiz == 0:
            return 0.0

        ear = (vert_1 + vert_2) / (2.0 * horiz)
        return ear

    def detect_blink(self, frame: np.ndarray) -> bool:
        """
        Returns True if a blink is detected in the given BGR frame.
        """
        # If FaceMesh is not available, we cannot detect blinks.
        if self._face_mesh is None or not self._left_eye_indices or not self._right_eye_indices:
            return False

        if frame is None or frame.size == 0:
            return False

        h, w = frame.shape[:2]
        # MediaPipe FaceMesh expects RGB
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        result = self._face_mesh.process(rgb)
        if not result.multi_face_landmarks:
            return False

        face_landmarks = result.multi_face_landmarks[0].landmark

        left_ear = self._eye_aspect_ratio(
            face_landmarks, self._left_eye_indices, w, h
        )
        right_ear = self._eye_aspect_ratio(
            face_landmarks, self._right_eye_indices, w, h
        )

        ear = (left_ear + right_ear) / 2.0

        return ear < self.ear_threshold

