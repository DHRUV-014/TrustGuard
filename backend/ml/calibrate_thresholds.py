import os
import numpy as np
import torch
from tqdm import tqdm
from PIL import Image

from transformers import AutoImageProcessor, AutoModelForImageClassification

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_ID = "dima806/deepfake_vs_real_image_detection"
FAKE_CLASS = 1

# ---------------- PATH FIX (CRITICAL) ----------------
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "best_model.pt")

DATA_DIR = os.path.join(BASE_DIR, "check")   # real/ fake/
MAX_IMAGES = 200


def load_model():
    model = AutoModelForImageClassification.from_pretrained(MODEL_ID)

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"❌ Model not found at {MODEL_PATH}")

    model.load_state_dict(
        torch.load(MODEL_PATH, map_location=DEVICE),
        strict=False
    )

    model.to(DEVICE).eval()
    processor = AutoImageProcessor.from_pretrained(MODEL_ID)
    return model, processor


def predict(img_path, model, processor):
    img = Image.open(img_path).convert("RGB")
    inputs = processor(images=img, return_tensors="pt").to(DEVICE)

    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=1)

    return float(probs[0][FAKE_CLASS])


def collect_scores(label):
    scores = []
    folder = os.path.join(DATA_DIR, label)

    files = [
        f for f in os.listdir(folder)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ][:MAX_IMAGES]

    for f in tqdm(files, desc=f"Collecting {label}"):
        scores.append(predict(os.path.join(folder, f), model, processor))

    return np.array(scores)


if __name__ == "__main__":
    model, processor = load_model()

    real_scores = collect_scores("real")
    fake_scores = collect_scores("fake")

    print("\n📊 CALIBRATION RESULTS\n")

    real_p95 = np.percentile(real_scores, 95)
    fake_p05 = np.percentile(fake_scores, 5)

    print(f"REAL 95th percentile : {real_p95:.4f}")
    print(f"FAKE 5th percentile  : {fake_p05:.4f}")

    print("\n✅ Suggested thresholds:")
    print(f"REAL if fake_prob <= {real_p95:.4f}")
    print(f"FAKE if fake_prob >= {fake_p05:.4f}")
    print("UNCERTAIN otherwise")