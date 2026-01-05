import torch
from ml.model import PatchMILModel

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model():
    model = PatchMILModel().to(DEVICE)
    state = torch.load("ml/best_model.pt", map_location=DEVICE)
    model.load_state_dict(state)
    model.eval()
    return model