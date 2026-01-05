from torchvision import transforms
from torch.utils.data import DataLoader

from ml.dataset import DeepfakeDataset

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

train_ds = DeepfakeDataset(
    root_dir="../data/data_split/train",
    transform=transform
)

val_ds = DeepfakeDataset(
    root_dir="../data/data_split/val",
    transform=transform
)

train_loader = DataLoader(train_ds, batch_size=16, shuffle=True)
val_loader = DataLoader(val_ds, batch_size=16)

print("Train samples:", len(train_ds))
print("Val samples:", len(val_ds))

images, labels = next(iter(train_loader))
print("Batch images:", images.shape)
print("Batch labels:", labels[:8])