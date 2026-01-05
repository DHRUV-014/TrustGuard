# =========================
# backend/ml/dataset.py
# (Balanced 10k subset – bias-controlled training)
# =========================
import os
import random
import torch
import torch.nn.functional as F
from PIL import Image
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

from ml.face_utils import get_face_boxes, crop_face_region

# ================= CONFIG =================
DATA_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "finetune")
)

BATCH_SIZE = 16

# 🔥 BALANCED SUBSET (bias control)
TRAIN_SAMPLES_PER_CLASS = 5000   # 5k real + 5k fake
SEED = 42

TRAIN_RESOLUTIONS = [256, 384]
VAL_RESOLUTION = 384

PATCH_SIZE = 224
STRIDE = 112
MAX_PATCHES = 5


# ================= PADDING =================
def pad_to_stride(img, patch_size=224, stride=112):
    _, H, W = img.shape
    pad_h = (stride - (H - patch_size) % stride) % stride
    pad_w = (stride - (W - patch_size) % stride) % stride
    return F.pad(img, (0, pad_w, 0, pad_h), mode="reflect")


# ================= PATCH EXTRACTION =================
def extract_patches(img, patch_size=224, stride=112, max_patches=5):
    img = pad_to_stride(img, patch_size, stride)
    _, H, W = img.shape

    patches = []
    for y in range(0, H - patch_size + 1, stride):
        for x in range(0, W - patch_size + 1, stride):
            patches.append(img[:, y:y + patch_size, x:x + patch_size])

    if len(patches) == 0:
        patches.append(img[:, :patch_size, :patch_size])

    patches = torch.stack(patches)

    if patches.size(0) > max_patches:
        idx = torch.randperm(patches.size(0))[:max_patches]
        patches = patches[idx]

    return patches


# ================= COLLATE =================
def collate_patches(batch):
    patches_list, labels = zip(*batch)
    B = len(patches_list)
    C, H, W = patches_list[0].shape[1:]
    batch_patches = torch.zeros(B, MAX_PATCHES, C, H, W)

    for i, patches in enumerate(patches_list):
        n = min(patches.size(0), MAX_PATCHES)
        batch_patches[i, :n] = patches[:n]

    labels = torch.stack(labels)
    return batch_patches, labels


# ================= DATASET =================
class DeepfakeDataset(Dataset):
    def __init__(self, split: str):
        assert split in ["train", "val"]
        self.split = split
        self.samples = []

        random.seed(SEED)

        self.transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225],
            ),
        ])

        split_dir = os.path.join(DATA_ROOT, split)
        classes = {"real": 0, "fake": 1}

        for cls, label in classes.items():
            cls_dir = os.path.join(split_dir, cls)
            if not os.path.isdir(cls_dir):
                continue

            files = [
                os.path.join(cls_dir, f)
                for f in os.listdir(cls_dir)
                if f.lower().endswith((".jpg", ".jpeg", ".png"))
            ]

            # 🔥 BALANCED SAMPLING (TRAIN ONLY)
            if split == "train":
                random.shuffle(files)
                files = files[:TRAIN_SAMPLES_PER_CLASS]

            for f in files:
                self.samples.append((f, label))

        random.shuffle(self.samples)
        print(f"📂 Loaded {len(self.samples)} samples for {split}")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        image = Image.open(path).convert("RGB")

        res = random.choice(TRAIN_RESOLUTIONS) if self.split == "train" else VAL_RESOLUTION
        image = image.resize((res, res), Image.BILINEAR)

        patches = []

        # ===== FACE PATCHES =====
        face_boxes = get_face_boxes(image)
        for box in face_boxes[:2]:
            face_crop = crop_face_region(image, box)
            face_crop = face_crop.resize((PATCH_SIZE, PATCH_SIZE), Image.BILINEAR)
            face_crop = self.transform(face_crop)

            face_patch = extract_patches(
                face_crop,
                PATCH_SIZE,
                stride=PATCH_SIZE,
                max_patches=1,
            )
            patches.append(face_patch)

        # ===== GLOBAL PATCHES =====
        image_tensor = self.transform(image)
        global_patches = extract_patches(
            image_tensor, PATCH_SIZE, STRIDE, MAX_PATCHES
        )
        patches.append(global_patches)

        patches = torch.cat(patches, dim=0)

        if patches.size(0) > MAX_PATCHES:
            idx = torch.randperm(patches.size(0))[:MAX_PATCHES]
            patches = patches[idx]

        return patches, torch.tensor(label, dtype=torch.long)


# ================= DATALOADERS =================
def get_dataloaders():
    train_ds = DeepfakeDataset("train")
    val_ds = DeepfakeDataset("val")

    train_loader = DataLoader(
        train_ds,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=2,
        pin_memory=True,
        collate_fn=collate_patches,
    )

    val_loader = DataLoader(
        val_ds,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=2,
        pin_memory=True,
        collate_fn=collate_patches,
    )

    return train_loader, val_loader