import os
import shutil
import uuid

from fastapi import FastAPI, UploadFile, File, Depends, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.firebase_auth import firebase_auth, firestore_db
from app.tasks import run_analysis_task

# ✅ ADD THIS
from app.routes import history

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
# ✅ HISTORY API
app.include_router(history.router)

# --------------------------------------------------
# UPLOADS
# --------------------------------------------------
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --------------------------------------------------
# POST /analyze
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
# GET /status/{job_id}
# --------------------------------------------------
@app.get("/status/{job_id}")
def get_status(job_id: str, user=Depends(firebase_auth)):
    doc = firestore_db.collection("jobs").document(job_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Job not found")

    return doc.to_dict()