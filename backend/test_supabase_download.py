from app.services.document_processor import (
    process_document,
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


document = response.data[0]

print("Testing document:")
print("ID:", document["id"])
print("Name:", document["name"])
print("Type:", document["file_type"])


result = process_document(
    document["id"]
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