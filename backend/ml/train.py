# =========================
# backend/ml/train.py
# =========================
import os
import torch
import torch.nn as nn
from torch.optim import AdamW
from tqdm import tqdm
from torch.cuda.amp import autocast, GradScaler

from ml.model import PatchMILModel
from ml.dataset import get_dataloaders

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

EPOCHS = 4
LR = 5e-5
SAVE_DIR = "ml"
SAVE_PATH = os.path.join(SAVE_DIR, "best_model.pt")


def train():
    print("🚀 Starting MIL fine-tuning pipeline with AMP...")

    # ---------------- SETUP ----------------
    os.makedirs(SAVE_DIR, exist_ok=True)

    train_loader, val_loader = get_dataloaders()
    model = PatchMILModel().to(DEVICE)

    # 🔥 Regularized loss (reduces overconfidence)
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)

    # 🔥 Weight decay added (critical)
    optimizer = AdamW(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=LR,
        weight_decay=1e-4,
    )

    scaler = GradScaler(enabled=(DEVICE.type == "cuda"))
    best_val_acc = 0.0

    # ================= TRAIN LOOP =================
    for epoch in range(EPOCHS):
        print(f"\n🚀 Epoch {epoch + 1}/{EPOCHS}")

        # ---------- TRAIN ----------
        model.train()
        correct, total, loss_sum = 0, 0, 0.0

        for patches, labels in tqdm(train_loader, desc="Training"):
            patches = patches.to(DEVICE, non_blocking=True)
            labels = labels.to(DEVICE, non_blocking=True)

            optimizer.zero_grad(set_to_none=True)

            with autocast(enabled=(DEVICE.type == "cuda")):
                logits = model(patches)
                loss = criterion(logits, labels)

            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()

            loss_sum += loss.item()
            preds = logits.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        train_acc = correct / total
        train_loss = loss_sum / len(train_loader)

        # ---------- VALIDATION ----------
        model.eval()
        correct, total = 0, 0

        with torch.no_grad():
            for patches, labels in tqdm(val_loader, desc="Validation"):
                patches = patches.to(DEVICE, non_blocking=True)
                labels = labels.to(DEVICE, non_blocking=True)

                with autocast(enabled=(DEVICE.type == "cuda")):
                    logits = model(patches)

                preds = logits.argmax(dim=1)
                correct += (preds == labels).sum().item()
                total += labels.size(0)

        val_acc = correct / total

        print(
            f"📊 Train Loss: {train_loss:.4f} | "
            f"Train Acc: {train_acc:.4f} | "
            f"Val Acc: {val_acc:.4f}"
        )

        # ---------- SAVE BEST ----------
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), SAVE_PATH)
            print(f"💾 Saved best model → {SAVE_PATH}")

    print("\n✅ Training complete")


if __name__ == "__main__":
    train()