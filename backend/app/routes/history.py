from fastapi import APIRouter, Depends
from app.firebase_auth import firebase_auth, firestore_db

router = APIRouter(prefix="/api/history", tags=["History"])

@router.get("")
def get_history(user=Depends(firebase_auth)):
    jobs = (
        firestore_db.collection("jobs")
        .where("user_id", "==", user["uid"])
        .order_by("created_at", direction="DESCENDING")
        .limit(25)
        .stream()
    )

    return [
        {
            "job_id": doc.id,
            **doc.to_dict()
        }
        for doc in jobs
    ]