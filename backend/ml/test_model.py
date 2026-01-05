import torch
from ml.model import PatchMILModel

model = PatchMILModel()
x = torch.randn(2, 9, 3, 224, 224)  # B=2, P=9

out = model(x)
print(out.shape)  # should be [2, 2]