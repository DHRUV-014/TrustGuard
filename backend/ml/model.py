# =========================
# backend/ml/model.py
# =========================
import torch
import torch.nn as nn
from transformers import AutoModelForImageClassification

MODEL_ID = "dima806/deepfake_vs_real_image_detection"


class PatchMILModel(nn.Module):
    def __init__(self):
        super().__init__()

        self.backbone = AutoModelForImageClassification.from_pretrained(
            MODEL_ID,
            num_labels=2,
            output_hidden_states=True,
        )

        for p in self.backbone.parameters():
            p.requires_grad = False

        for p in self.backbone.classifier.parameters():
            p.requires_grad = True

        if hasattr(self.backbone.base_model, "encoder"):
            for p in self.backbone.base_model.encoder.layer[-1].parameters():
                p.requires_grad = True

        hidden_size = self.backbone.config.hidden_size

        self.attention = nn.Sequential(
            nn.Linear(hidden_size, hidden_size // 2),
            nn.Tanh(),
            nn.Linear(hidden_size // 2, 1),
        )

        self.classifier = self.backbone.classifier

    def forward(self, x):
        B, P, C, H, W = x.shape
        x = x.view(B * P, C, H, W)

        outputs = self.backbone.base_model(pixel_values=x)
        feats = outputs.last_hidden_state[:, 0]
        feats = feats.view(B, P, -1)

        attn = self.attention(feats)
        attn = torch.softmax(attn, dim=1)
        pooled = (attn * feats).sum(dim=1)

        logits = self.classifier(pooled)
        return logits