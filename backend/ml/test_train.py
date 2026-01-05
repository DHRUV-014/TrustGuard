import torch
import torch.nn as nn

from ml.dataset import get_dataloaders
from ml.model import PatchMILModel

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def main():
    print("🔍 Running training pipeline sanity test...")

    # ---------------- LOAD DATA ----------------
    train_loader, _ = get_dataloaders()
    patches, labels = next(iter(train_loader))

    print(f"📦 Patches shape: {patches.shape}")
    print(f"🏷️  Labels shape: {labels.shape}")

    # Expected:
    # patches → [B, P, 3, 224, 224]
    # labels  → [B]

    assert patches.ndim == 5, "❌ Patches must be 5D [B, P, C, H, W]"
    assert patches.shape[2:] == (3, 224, 224), "❌ Patch shape incorrect"

    # ---------------- LOAD MODEL ----------------
    model = PatchMILModel().to(DEVICE)
    criterion = nn.CrossEntropyLoss()

    patches = patches.to(DEVICE)
    labels = labels.to(DEVICE)

    # ---------------- FORWARD ----------------
    logits = model(patches)
    print(f"🧠 Logits shape: {logits.shape}")

    assert logits.shape[0] == labels.shape[0], "❌ Batch size mismatch"
    assert logits.shape[1] == 2, "❌ Output classes must be 2"

    # ---------------- LOSS ----------------
    loss = criterion(logits, labels)
    print(f"📉 Loss value: {loss.item():.4f}")

    # ---------------- BACKWARD ----------------
    loss.backward()
    print("✅ Backward pass successful")

    print("\n🎉 TEST PASSED — training pipeline is READY")


if __name__ == "__main__":
    main()