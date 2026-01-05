import os
import cv2
from tqdm import tqdm
from utils.face_engine import FaceEngine

SRC_DIR = "backend/data/raw_sources/FaceForensics/dataset/DeepFakes"
DST_DIR = "backend/data/finetune_processed/train/fake"
MAX_FACES = 3000

os.makedirs(DST_DIR, exist_ok=True)
engine = FaceEngine()

count = 0
for root, _, files in os.walk(SRC_DIR):
    for img_name in files:
        if count >= MAX_FACES:
            break

        if not img_name.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        path = os.path.join(root, img_name)

        with open(path, "rb") as f:
            faces = engine.process_image(f.read())

        if not faces:
            continue

        face = faces[0]["model"]
        out_path = os.path.join(DST_DIR, f"fake_{count:05d}.jpg")
        cv2.imwrite(out_path, face)
        count += 1

print(f"✅ Saved {count} cropped faces")