import cv2
import numpy as np
import torch
import torch.nn.functional as F

from torchvision.models import efficientnet_b0


# --------------------------------------------------
# Load explainer model (CNN for Grad-CAM)
# --------------------------------------------------

_explainer_model = None

def load_explainer_model():
    global _explainer_model
    if _explainer_model is None:
        model = efficientnet_b0(weights="IMAGENET1K_V1")
        model.eval()
        _explainer_model = model
    return _explainer_model


# --------------------------------------------------
# Grad-CAM
# --------------------------------------------------

def generate_heatmap(face_bgr: np.ndarray) -> np.ndarray:
    # face_bgr MUST be the SAME face used for UI

    model = load_explainer_model()

    rgb = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2RGB)

    tensor = (
        torch.from_numpy(rgb)
        .permute(2, 0, 1)
        .float()
        .unsqueeze(0) / 255.0
    )

    activations, gradients = [], []

    def fwd(_, __, out): activations.append(out)
    def bwd(_, gi, go): gradients.append(go[0])

    layer = model.features[-1]
    layer.register_forward_hook(fwd)
    layer.register_full_backward_hook(bwd)

    out = model(tensor)
    out.mean().backward()

    cam = (gradients[0].mean((2, 3), keepdim=True) * activations[0]).sum(1)
    cam = torch.relu(cam)
    cam = cam / (cam.max() + 1e-8)

    cam = cam.squeeze().detach().cpu().numpy()
    cam = cv2.resize(cam, (face_bgr.shape[1], face_bgr.shape[0]))

    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    return cv2.addWeighted(face_bgr, 0.6, heatmap, 0.4, 0)