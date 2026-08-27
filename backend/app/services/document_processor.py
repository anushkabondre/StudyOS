from datetime import datetime, timezone
from io import BytesIO

from pptx import Presentation

from app.services.ocr_service import extract_text_from_image
from app.supabase_client import supabase


BUCKET_NAME = "documents"


def get_document(document_id: str) -> dict:
    response = (
        supabase
        .from_("documents")
        .select("*")
        .eq("id", document_id)
        .single()
        .execute()
    )

    if response.data is None:
        raise RuntimeError(
            f"Document not found: {document_id}"
        )

    return response.data


def download_document(file_path: str) -> bytes:
    try:
        return (
            supabase.storage
            .from_(BUCKET_NAME)
            .download(file_path)
        )

    except Exception as error:
        raise RuntimeError(
            f"Failed to download document: {error}"
        ) from error


def update_document(
    document_id: str,
    *,
    extracted_text: str | None,
    processing_status: str,
    extraction_method: str | None,
    ocr_confidence: float | None,
) -> dict:
    response = (
        supabase
        .from_("documents")
        .update(
            {
                "extracted_text": extracted_text,
                "processing_status": processing_status,
                "extraction_method": extraction_method,
                "ocr_confidence": ocr_confidence,
                "processed_at": datetime.now(
                    timezone.utc
                ).isoformat(),
            }
        )
        .eq("id", document_id)
        .execute()
    )

    if response.data is None:
        raise RuntimeError(
            f"Failed to update document: {document_id}"
        )

    return response.data[0]


def extract_text_from_pptx(
    file_bytes: bytes,
) -> str:
    presentation = Presentation(
        BytesIO(file_bytes)
    )

    slide_texts: list[str] = []

    for slide_number, slide in enumerate(
        presentation.slides,
        start=1,
    ):
        text_parts: list[str] = []

        for shape in slide.shapes:
            if not hasattr(shape, "text"):
                continue

            text = shape.text.strip()

            if text:
                text_parts.append(text)

        if text_parts:
            slide_texts.append(
                f"[Slide {slide_number}]\n"
                + "\n".join(text_parts)
            )

    return "\n\n".join(slide_texts)


def process_pptx_document(
    document_id: str,
) -> dict:
    document = get_document(document_id)

    file_type = document.get("file_type") or ""

    if file_type not in (
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ):
        raise RuntimeError(
            "This processor currently supports PPTX/PPT documents only."
        )

    update_document(
        document_id,
        extracted_text=None,
        processing_status="processing",
        extraction_method=None,
        ocr_confidence=None,
    )

    try:
        file_bytes = download_document(
            document["file_path"]
        )

        extracted_text = extract_text_from_pptx(
            file_bytes
        )

        updated_document = update_document(
            document_id,
            extracted_text=extracted_text,
            processing_status="completed",
            extraction_method="pptx",
            ocr_confidence=None,
        )

        return updated_document

    except Exception as error:
        update_document(
            document_id,
            extracted_text=None,
            processing_status="failed",
            extraction_method="pptx",
            ocr_confidence=None,
        )

        raise RuntimeError(
            f"PPTX processing failed: {error}"
        ) from error