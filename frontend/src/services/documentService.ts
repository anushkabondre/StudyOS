import { supabase } from "../supabase/supabase";

export interface DocumentRecord {
  id: string;
  user_id: string;
  name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  extracted_text: string | null;
  processing_status: string;
  extraction_method: string | null;
  processed_at: string | null;
  ocr_confidence: number | null;
  created_at: string;
}

const BUCKET_NAME = "documents";

const BACKEND_URL = "http://127.0.0.1:8000";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024;


// --------------------------------------------------
// Upload Document
// --------------------------------------------------

export async function uploadDocument(
  userId: string,
  file: File
): Promise<DocumentRecord> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      "Unsupported file type. Please upload PDF, image, DOC/DOCX, PPT/PPTX, or TXT."
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "File is too large. Maximum size is 20 MB."
    );
  }

  const safeFileName = file.name.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );

  const filePath =
    `${userId}/${crypto.randomUUID()}-${safeFileName}`;

  // Upload file to Supabase Storage
  const { error: uploadError } =
    await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

  if (uploadError) {
    throw new Error(
      `File upload failed: ${uploadError.message}`
    );
  }

  // Create database record
  const { data, error: insertError } =
    await supabase
      .from("documents")
      .insert({
        user_id: userId,
        name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        extracted_text: null,
        processing_status: "pending",
        extraction_method: null,
        processed_at: null,
        ocr_confidence: null,
      })
      .select()
      .single();

  if (insertError) {
    await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    throw new Error(
      `Document record failed: ${insertError.message}`
    );
  }

  return data as DocumentRecord;
}


// --------------------------------------------------
// Process Document
// --------------------------------------------------

export async function processDocument(
  documentId: string
): Promise<DocumentRecord> {
  const response = await fetch(
    `${BACKEND_URL}/documents/${documentId}/process`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let responseData: unknown = null;

  try {
    responseData = await response.json();
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    const message =
      typeof responseData === "object" &&
      responseData !== null &&
      "detail" in responseData &&
      typeof responseData.detail === "string"
        ? responseData.detail
        : "Document processing failed.";

    throw new Error(message);
  }

  if (
    typeof responseData !== "object" ||
    responseData === null ||
    !("document" in responseData)
  ) {
    throw new Error(
      "Invalid response received from document processor."
    );
  }

  return responseData.document as DocumentRecord;
}


// --------------------------------------------------
// Get Documents
// --------------------------------------------------

export async function getDocuments(): Promise<
  DocumentRecord[]
> {
  const { data, error } =
    await supabase
      .from("documents")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw new Error(
      `Could not load documents: ${error.message}`
    );
  }

  return (data ?? []) as DocumentRecord[];
}


// --------------------------------------------------
// Download Document
// --------------------------------------------------

export async function downloadDocument(
  documentRecord: DocumentRecord
): Promise<void> {
  const { data, error } =
    await supabase.storage
      .from(BUCKET_NAME)
      .download(documentRecord.file_path);

  if (error) {
    throw new Error(
      `Document download failed: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      "Document download failed: file not found."
    );
  }

  const url = URL.createObjectURL(data);

  const link = window.document.createElement("a");

  link.href = url;
  link.download = documentRecord.name;

  window.document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);
}


// --------------------------------------------------
// Delete Document
// --------------------------------------------------

export async function deleteDocument(
  documentRecord: DocumentRecord
): Promise<void> {
  const { error: storageError } =
    await supabase.storage
      .from(BUCKET_NAME)
      .remove([
        documentRecord.file_path,
      ]);

  if (storageError) {
    throw new Error(
      `File deletion failed: ${storageError.message}`
    );
  }

  const { error: databaseError } =
    await supabase
      .from("documents")
      .delete()
      .eq("id", documentRecord.id);

  if (databaseError) {
    throw new Error(
      `Document deletion failed: ${databaseError.message}`
    );
  }
}