from io import BytesIO

import numpy as np
from PIL import Image
from paddleocr import PaddleOCR


ocr = PaddleOCR(
    lang="en",
    ocr_version="PP-OCRv5",
    device="cpu",
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
)


def extract_text_from_image(
    image_bytes: bytes,
) -> dict:
    image = Image.open(
        BytesIO(image_bytes)
    ).convert("RGB")

    image_array = np.array(image)

    results = ocr.predict(image_array)

    texts: list[str] = []
    scores: list[float] = []

    for result in results:
        result_data = result.json

        if "res" in result_data:
            result_data = result_data["res"]

        texts.extend(
            result_data.get(
                "rec_texts",
                [],
            )
        )

        scores.extend(
            result_data.get(
                "rec_scores",
                [],
            )
        )

    cleaned_texts = [
        text.strip()
        for text in texts
        if text.strip()
    ]

    full_text = "\n".join(
        cleaned_texts
    )

    average_confidence = (
        sum(scores) / len(scores)
        if scores
        else 0.0
    )

    return {
        "text": full_text,
        "confidence": round(
            average_confidence,
            4,
        ),
        "lines": len(cleaned_texts),
    }