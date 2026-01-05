from ml.dataset import DeepfakeDataset

ds = DeepfakeDataset("train")

patches, label = ds[0]

print("Type:", type(patches))
print("Patches shape:", patches.shape)
print("Label:", label)