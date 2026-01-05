from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import firebase_admin
from firebase_admin import credentials, auth, firestore, exceptions

# --------------------------------------------------
# Firebase initialization (ONCE)
# --------------------------------------------------

cred = credentials.Certificate("firebase_key.json")

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# --------------------------------------------------
# Global clients
# --------------------------------------------------

firestore_db = firestore.client()

# --------------------------------------------------
# Auth dependency
# --------------------------------------------------

security = HTTPBearer(auto_error=False)


def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication credentials",
        )

    try:
        decoded_token = auth.verify_id_token(credentials.credentials)
        return decoded_token

    except exceptions.FirebaseError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase token: {str(e)}",
        )


# 🔥 TEMPORARY DEV MODE (AUTH DISABLED)
def firebase_auth():
    return {"uid": "dev-user", "email": "dev@test.local"}