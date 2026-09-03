from fastapi import (
    FastAPI,
    HTTPException,
    File,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware

from app.services.ocr_service import (
    extract_text_from_image,
)
from app.services.document_processor import (
    process_document,
)


app = FastAPI(
    title="StudyOS API",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "StudyOS API",
    }


# --------------------------------------------------
# Direct Image OCR
# --------------------------------------------------

@app.post("/ocr")
async def ocr_image(
    file: UploadFile = File(...),
):
    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be determined.",
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="OCR currently supports image files only.",
        )

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    try:
        result = extract_text_from_image(
            image_bytes
        )

        return {
            "filename": file.filename,
            **result,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {error}",
        ) from error


# --------------------------------------------------
# Process Stored Document
# --------------------------------------------------

@app.post("/documents/{document_id}/process")
def process_stored_document(
    document_id: str,
):
    try:
        result = process_document(
            document_id
        )

        return {
            "success": True,
            "document": result,
        }

    except RuntimeError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Document processing failed: {error}",
        ) from error