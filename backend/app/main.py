import os
import shutil
import uuid
import time
import cv2
import numpy as np

from fastapi import FastAPI, UploadFile, File, Depends, BackgroundTasks, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.firebase_auth import firebase_auth, firestore_db
from app.tasks import run_analysis_task

# ✅ HISTORY ROUTE
from app.routes import history

# ✅ NEW: Challenge pipeline
from services.challenge_pipeline import ChallengeSession
from services.monitor_service import VideoCallMonitor

app = FastAPI()

# --------------------------------------------------
# CORS
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# STATIC FILES
# --------------------------------------------------
os.makedirs("faces", exist_ok=True)
os.makedirs("heatmaps", exist_ok=True)

app.mount("/faces", StaticFiles(directory="faces"), name="faces")
app.mount("/heatmaps", StaticFiles(directory="heatmaps"), name="heatmaps")

# --------------------------------------------------
# REGISTER ROUTES
# --------------------------------------------------
app.include_router(history.router)

# --------------------------------------------------
# UPLOADS
# --------------------------------------------------
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --------------------------------------------------
# ACTIVE CHALLENGE SESSIONS STORAGE
# --------------------------------------------------
challenge_sessions = {}

# --------------------------------------------------
# CREATOR VERIFICATION SESSIONS STORAGE
# --------------------------------------------------
verification_sessions = {}

# --------------------------------------------------
# VIDEO CALL MONITOR INSTANCES (per client)
# --------------------------------------------------
video_monitors = {}

# --------------------------------------------------
# POST /challenge/start
# --------------------------------------------------
@app.post("/challenge/start")
def start_challenge():
    session_id = uuid.uuid4().hex
    challenge_sessions[session_id] = ChallengeSession()
    return {"session_id": session_id}

# --------------------------------------------------
# POST /challenge/frame/{session_id}
# --------------------------------------------------
@app.post("/challenge/frame/{session_id}")
async def upload_challenge_frame(
    session_id: str,
    file: UploadFile = File(...),
):
    if session_id not in challenge_sessions:
        raise HTTPException(status_code=404, detail="Invalid session")

    contents = await file.read()
    np_img = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    challenge_sessions[session_id].add_frame(frame)

    return {"status": "frame added"}

# --------------------------------------------------
# GET /challenge/analyze/{session_id}
# --------------------------------------------------
@app.get("/challenge/analyze/{session_id}")
def analyze_challenge(session_id: str):
    if session_id not in challenge_sessions:
        raise HTTPException(status_code=404, detail="Invalid session")

    result = challenge_sessions[session_id].analyze_reflectance()

    # Optional: cleanup session
    del challenge_sessions[session_id]

    return result

# --------------------------------------------------
# POST /analyze  (UNCHANGED)
# --------------------------------------------------
@app.post("/analyze")
async def analyze(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user=Depends(firebase_auth),
):
    if file is None:
        raise HTTPException(status_code=400, detail="File is required")

    job_id = uuid.uuid4().hex
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    firestore_db.collection("jobs").document(job_id).set({
        "status": "PENDING",
        "user_id": user["uid"],
    })

    background_tasks.add_task(
        run_analysis_task,
        job_id=job_id,
        file_path=file_path,
        user_id=user["uid"],
    )

    return {
        "job_id": job_id,
        "status": "PENDING",
    }

# --------------------------------------------------
# GET /status/{job_id}  (UNCHANGED)
# --------------------------------------------------
@app.get("/status/{job_id}")
def get_status(job_id: str, user=Depends(firebase_auth)):
    doc = firestore_db.collection("jobs").document(job_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Job not found")

    return doc.to_dict()

# ==================================================
# FEATURE 1: CREATOR VERIFICATION
# ==================================================

# --------------------------------------------------
# POST /verify/creator/start
# --------------------------------------------------
@app.post("/verify/creator/start")
def start_creator_verification():
    """Initialize a new creator verification session."""
    session_id = uuid.uuid4().hex
    verification_sessions[session_id] = ChallengeSession()
    return {"session_id": session_id}

# --------------------------------------------------
# POST /verify/creator/frame/{session_id}
# --------------------------------------------------
@app.post("/verify/creator/frame/{session_id}")
async def upload_verification_frame(
    session_id: str,
    file: UploadFile = File(...),
):
    """Add a frame to the creator verification session."""
    if session_id not in verification_sessions:
        raise HTTPException(status_code=404, detail="Invalid session")

    contents = await file.read()
    np_img = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    verification_sessions[session_id].add_frame(frame)

    return {"status": "frame added"}

# --------------------------------------------------
# GET /verify/creator/result/{session_id}
# --------------------------------------------------
@app.get("/verify/creator/result/{session_id}")
def get_verification_result(session_id: str):
    """Get creator verification result with creator_verified flag."""
    if session_id not in verification_sessions:
        raise HTTPException(status_code=404, detail="Invalid session")

    result = verification_sessions[session_id].analyze_reflectance()

    # Add creator_verified field
    if "error" in result:
        result["creator_verified"] = False
    else:
        result["creator_verified"] = result.get("verdict") == "Live Person"

    # Cleanup session
    del verification_sessions[session_id]

    return result

# ==================================================
# FEATURE 2: VIDEO CALL DEEPFAKE MONITORING
# ==================================================

# --------------------------------------------------
# POST /monitor/frame
# --------------------------------------------------
@app.post("/monitor/frame")
async def monitor_video_frame(
    file: UploadFile = File(...),
    client_id: str = Query(default="default", description="Client identifier for session tracking"),
):
    """
    Analyze a single video call frame for deepfake detection.
    Uses rolling window smoothing for stability.
    """
    # Use client_id if provided, otherwise generate a session-based ID
    # For simplicity, we'll use a default client_id if not provided
    if client_id is None:
        client_id = "default"

    # Initialize monitor if not exists
    if client_id not in video_monitors:
        video_monitors[client_id] = VideoCallMonitor(window_size=5)

    # Decode frame
    contents = await file.read()
    np_img = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image data")

    # Analyze frame
    result = video_monitors[client_id].analyze_frame(frame)

    return result