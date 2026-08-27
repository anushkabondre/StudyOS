from fastapi import (
    FastAPI,
    File,
    HTTPException,
    UploadFile,
)

from app.services.ocr_service import (
    extract_text_from_image,
)


app = FastAPI(
    title="StudyOS API",
    version="1.0.0",
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "StudyOS API",
    }


@app.post("/ocr")
async def ocr_image(
    file: UploadFile = File(...),
):
    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be determined.",
        )

    if not file.content_type.startswith(
        "image/"
    ):
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