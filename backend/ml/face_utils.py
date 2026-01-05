import torch
from facenet_pytorch import MTCNN
from torchvision.transforms.functional import crop

# Initialize once (CPU is fine for dataloader)
mtcnn = MTCNN(keep_all=True, device="cpu")

def get_face_boxes(pil_img):
    """
    Returns list of face boxes [x1, y1, x2, y2]
    """
    boxes, _ = mtcnn.detect(pil_img)
    if boxes is None:
        return []
    return boxes.astype(int).tolist()


def crop_face_region(pil_img, box, margin=0.3):
    """
    Expands face box slightly to include context
    """
    w, h = pil_img.size
    x1, y1, x2, y2 = box

    bw, bh = x2 - x1, y2 - y1
    mx, my = int(bw * margin), int(bh * margin)

    x1 = max(0, x1 - mx)
    y1 = max(0, y1 - my)
    x2 = min(w, x2 + mx)
    y2 = min(h, y2 + my)

    return pil_img.crop((x1, y1, x2, y2))