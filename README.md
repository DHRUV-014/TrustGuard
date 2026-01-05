# TrustGuard 🔐  
**Making media authenticity easier to trust**

TrustGuard is an AI-powered tool built to detect deepfake images and videos.  
With the rise of manipulated media, it’s becoming harder to know what’s real and what’s not — TrustGuard is our attempt to help bridge that gap.

This project focuses on **clarity over complexity**: upload media, analyze it, and get an understandable result with visual cues instead of black-box numbers.

---

## Why TrustGuard?

Deepfakes are no longer experimental — they’re everywhere.  
From social media misinformation to identity misuse, the impact is real.

TrustGuard was built to:
- help **verify media authenticity**
- provide **transparent results**, not just a yes/no
- be **developer-friendly and scalable**
- work as a foundation for larger trust & safety systems

---

## What it does

- Analyzes images and videos for deepfake manipulation  
- Generates heatmaps to show *where* the manipulation is likely present  
- Provides a confidence score instead of vague outputs  
- Exposes everything through a clean API  
- Includes a simple frontend for real-world usage  

---

## Tech behind it

### Backend
- Python + FastAPI  
- PyTorch for deep learning inference  
- Firebase Admin for authentication  
- OpenCV / NumPy for media processing  

### Frontend
- Modern JS framework (React / Next.js)  
- Clean UI focused on usability  
- API-driven architecture  

### AI
- CNN-based deepfake detection models  
- Attention / Grad-CAM based heatmaps  
- Fine-tuned models (weights intentionally not committed)

