import os
import random
import shutil

random.seed(42)

SRC_REAL = "../data/real_and_fake_face/training_real"
SRC_FAKE = "../data/real_and_fake_face/training_fake"

DST = "data/finetune"
TRAIN_RATIO = 0.8


def split_class(src, dst_train, dst_val):
    files = os.listdir(src)
    random.shuffle(files)

    split = int(len(files) * TRAIN_RATIO)
    train_files = files[:split]
    val_files = files[split:]

    for f in train_files:
        shutil.copy(os.path.join(src, f), os.path.join(dst_train, f))

    for f in val_files:
        shutil.copy(os.path.join(src, f), os.path.join(dst_val, f))


os.makedirs(f"{DST}/train/real", exist_ok=True)
os.makedirs(f"{DST}/train/fake", exist_ok=True)
os.makedirs(f"{DST}/val/real", exist_ok=True)
os.makedirs(f"{DST}/val/fake", exist_ok=True)

split_class(SRC_REAL, f"{DST}/train/real", f"{DST}/val/real")
split_class(SRC_FAKE, f"{DST}/train/fake", f"{DST}/val/fake")

print("✅ Dataset split complete")