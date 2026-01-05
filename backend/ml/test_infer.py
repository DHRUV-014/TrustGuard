import os
import torch
from PIL import Image
from torchvision import transforms

from ml.model import PatchMILModel
from ml.dataset import extract_patches, pad_to_stride, PATCH_SIZE, STRIDE, MAX_PATCHES

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

MODEL_PATH = "ml/best_model.pt"
CHECK_DIR = "ml/check"

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])

def predict_image(img_path, model):
    image = Image.open(img_path).convert("RGB")
    image = image.resize((384, 384), Image.BILINEAR)

    img_tensor = transform(image)
    patches = extract_patches(
        img_tensor,
        PATCH_SIZE,
        STRIDE,
        MAX_PATCHES
    )

    patches = patches.unsqueeze(0).to(DEVICE)  # [1, P, 3, 224, 224]

    with torch.no_grad():
        logits = model(patches)
        probs = torch.softmax(logits, dim=1)[0]

    return probs.cpu().numpy()

def main():
    model = PatchMILModel().to(DEVICE)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()

    for label in ["real", "fake"]:
        folder = os.path.join(CHECK_DIR, label)
        print(f"\n📂 Testing {label.upper()} images")

        for fname in os.listdir(folder):
            if not fname.lower().endswith((".jpg", ".png", ".jpeg")):
                continue

            path = os.path.join(folder, fname)
            real_p, fake_p = predict_image(path, model)

            verdict = "REAL" if real_p > fake_p else "FAKE"

            print(
                f"{fname:15} → "
                f"REAL: {real_p:.3f} | FAKE: {fake_p:.3f} | "
                f"PRED: {verdict}"
            )

if __name__ == "__main__":
    main()