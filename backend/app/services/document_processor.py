from datetime import datetime, timezone
from io import BytesIO

from pptx import Presentation
from docx import Document
from pypdf import PdfReader

from app.services.ocr_service import extract_text_from_image
from app.supabase_client import supabase


BUCKET_NAME = "documents"


# --------------------------------------------------
# Database helpers
# --------------------------------------------------

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


# --------------------------------------------------
# Image processing
# --------------------------------------------------

def process_image_document(
    document_id: str,
) -> dict:
    document = get_document(document_id)

    file_type = document.get("file_type") or ""

    if not file_type.startswith("image/"):
        raise RuntimeError(
            f"Document is not an image: {file_type}"
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

        ocr_result = extract_text_from_image(
            file_bytes
        )

        extracted_text = ocr_result.get(
            "text",
            "",
        )

        confidence = ocr_result.get(
            "confidence",
            0.0,
        )

        updated_document = update_document(
            document_id,
            extracted_text=extracted_text,
            processing_status="completed",
            extraction_method="paddleocr",
            ocr_confidence=confidence,
        )

        return updated_document

    except Exception as error:
        update_document(
            document_id,
            extracted_text=None,
            processing_status="failed",
            extraction_method="paddleocr",
            ocr_confidence=None,
        )

        raise RuntimeError(
            f"Image processing failed: {error}"
        ) from error


# --------------------------------------------------
# PPTX processing
# --------------------------------------------------

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


# --------------------------------------------------
# PDF processing
# --------------------------------------------------

def extract_text_from_pdf(
    file_bytes: bytes,
) -> str:
    reader = PdfReader(
        BytesIO(file_bytes)
    )

    page_texts: list[str] = []

    for page_number, page in enumerate(
        reader.pages,
        start=1,
    ):
        text = page.extract_text() or ""
        text = text.strip()

        if text:
            page_texts.append(
                f"[Page {page_number}]\n{text}"
            )

    return "\n\n".join(page_texts)


def process_pdf_document(
    document_id: str,
) -> dict:
    document = get_document(document_id)

    file_type = document.get("file_type") or ""

    if file_type != "application/pdf":
        raise RuntimeError(
            f"Document is not a PDF: {file_type}"
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

        extracted_text = extract_text_from_pdf(
            file_bytes
        )

        if not extracted_text.strip():
            raise RuntimeError(
                "No text could be extracted from this PDF."
            )

        updated_document = update_document(
            document_id,
            extracted_text=extracted_text,
            processing_status="completed",
            extraction_method="pypdf",
            ocr_confidence=None,
        )

        return updated_document

    except Exception as error:
        update_document(
            document_id,
            extracted_text=None,
            processing_status="failed",
            extraction_method="pypdf",
            ocr_confidence=None,
        )

        raise RuntimeError(
            f"PDF processing failed: {error}"
        ) from error

# --------------------------------------------------
# TXT processing
# --------------------------------------------------

def extract_text_from_txt(
    file_bytes: bytes,
) -> str:
    try:
        return file_bytes.decode(
            "utf-8"
        ).strip()

    except UnicodeDecodeError:
        return file_bytes.decode(
            "utf-8",
            errors="replace",
        ).strip()


def process_txt_document(
    document_id: str,
) -> dict:
    document = get_document(
        document_id
    )

    file_type = document.get(
        "file_type"
    ) or ""

    if file_type != "text/plain":
        raise RuntimeError(
            f"Document is not a TXT file: {file_type}"
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

        extracted_text = extract_text_from_txt(
            file_bytes
        )

        if not extracted_text.strip():
            raise RuntimeError(
                "The TXT file is empty."
            )

        updated_document = update_document(
            document_id,
            extracted_text=extracted_text,
            processing_status="completed",
            extraction_method="text",
            ocr_confidence=None,
        )

        return updated_document

    except Exception as error:
        update_document(
            document_id,
            extracted_text=None,
            processing_status="failed",
            extraction_method="text",
            ocr_confidence=None,
        )

        raise RuntimeError(
            f"TXT processing failed: {error}"
        ) from error
# --------------------------------------------------
# DOCX processing
# --------------------------------------------------

def extract_text_from_docx(
    file_bytes: bytes,
) -> str:
    document = Document(
        BytesIO(file_bytes)
    )

    text_parts: list[str] = []

    # Extract paragraphs
    for paragraph in document.paragraphs:
        text = paragraph.text.strip()

        if text:
            text_parts.append(text)

    # Extract tables
    for table in document.tables:
        for row in table.rows:
            row_text: list[str] = []

            for cell in row.cells:
                text = cell.text.strip()

                if text:
                    row_text.append(text)

            if row_text:
                text_parts.append(
                    " | ".join(row_text)
                )

    return "\n".join(text_parts)


def process_docx_document(
    document_id: str,
) -> dict:
    document = get_document(
        document_id
    )

    file_type = document.get(
        "file_type"
    ) or ""

    if file_type != (
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ):
        raise RuntimeError(
            f"Document is not a DOCX file: {file_type}"
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

        extracted_text = extract_text_from_docx(
            file_bytes
        )

        if not extracted_text.strip():
            raise RuntimeError(
                "No text could be extracted from this DOCX file."
            )

        updated_document = update_document(
            document_id,
            extracted_text=extracted_text,
            processing_status="completed",
            extraction_method="python-docx",
            ocr_confidence=None,
        )

        return updated_document

    except Exception as error:
        update_document(
            document_id,
            extracted_text=None,
            processing_status="failed",
            extraction_method="python-docx",
            ocr_confidence=None,
        )

        raise RuntimeError(
            f"DOCX processing failed: {error}"
        ) from error    
# --------------------------------------------------
# Unified document processor
# --------------------------------------------------

def process_document(
    document_id: str,
) -> dict:
    document = get_document(
        document_id
    )

    file_type = document.get(
        "file_type"
    ) or ""

    if file_type.startswith("image/"):
        return process_image_document(
            document_id
        )

    if file_type in (
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ):
        return process_pptx_document(
            document_id
        )

    if file_type == "application/pdf":
        return process_pdf_document(
            document_id
        )
    if file_type == "text/plain":
        return process_txt_document(
            document_id
    )
    if file_type == (
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
):
        return process_docx_document(
            document_id
        )

    raise RuntimeError(
        f"Unsupported document type: {file_type}"
    )