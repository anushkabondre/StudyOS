from app.services.document_processor import (
    get_document,
    process_pptx_document,
)
from app.supabase_client import supabase


response = (
    supabase
    .from_("documents")
    .select("id, name, file_type")
    .in_(
        "file_type",
        [
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ],
    )
    .order("created_at", desc=True)
    .limit(1)
    .execute()
)


if not response.data:
    raise RuntimeError(
        "No PPTX documents found."
    )


document_id = response.data[0]["id"]

print("Testing document:")
print("ID:", document_id)
print("Name:", response.data[0]["name"])
print("Type:", response.data[0]["file_type"])


result = process_pptx_document(
    document_id
)


print("\nProcessing successful!")
print("Status:", result["processing_status"])
print(
    "Method:",
    result["extraction_method"],
)
print(
    "Extracted characters:",
    len(result["extracted_text"] or ""),
)