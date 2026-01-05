import os
import time
import google.generativeai as genai
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

router = APIRouter()

genai.configure(api_key=os.getenv("AIzaSyBtYvVRP5OQ8qdI3Kf672GQfkqxNqtc4N8"))
model = genai.GenerativeModel("gemini-1.5-pro")

@router.get("/explain")
def explain(label: str, score: float):

    prompt = f"""
Explain briefly why the media was classified as {label}.
Risk score: {score}%.
Use short bullet-style sentences.
"""

    def stream():
        response = model.generate_content(prompt, stream=True)
        for chunk in response:
            if chunk.text:
                for ch in chunk.text:
                    yield f"data:{ch}\n\n"
                    time.sleep(0.02)

    return StreamingResponse(stream(), media_type="text/event-stream")