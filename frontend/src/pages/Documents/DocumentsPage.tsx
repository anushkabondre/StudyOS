import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { ChangeEvent } from "react";

import {
  FileText,
  Image,
  Trash2,
  Upload,
  Loader2,
  File,
  Download,
} from "lucide-react";

import {
  useSupabaseAuth,
} from "../../context/SupabaseAuthContext";

import {
  deleteDocument,
  downloadDocument,
  getDocuments,
  uploadDocument,
  type DocumentRecord,
} from "../../services/documentService";

function formatFileSize(
  bytes: number | null
): string {
  if (!bytes) {
    return "Unknown size";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function getFileIcon(
  fileType: string | null
) {
  if (fileType?.startsWith("image/")) {
    return Image;
  }

  if (fileType === "application/pdf") {
    return FileText;
  }

  return File;
}

export default function DocumentsPage() {
  const { user } =
    useSupabaseAuth();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [documents, setDocuments] =
    useState<DocumentRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  async function loadDocuments() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getDocuments();

      setDocuments(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file || !user) {
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      await uploadDocument(
        user.id,
        file
      );

      setMessage(
        `${file.name} uploaded successfully.`
      );

      await loadDocuments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleDownload(
    documentRecord: DocumentRecord
  ) {
    try {
      setError("");
      setMessage("");

      await downloadDocument(
        documentRecord
      );

      setMessage(
        `${documentRecord.name} downloaded successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Download failed."
      );
    }
  }

  async function handleDelete(
    documentRecord: DocumentRecord
  ) {
    const confirmed =
      window.confirm(
        `Delete "${documentRecord.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        documentRecord.id
      );

      setError("");
      setMessage("");

      await deleteDocument(
        documentRecord
      );

      setDocuments((current) =>
        current.filter(
          (item) =>
            item.id !==
            documentRecord.id
        )
      );

      setMessage(
        `${documentRecord.name} deleted.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Delete failed."
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (!user) {
    return (
      <div className="p-8 text-white">
        Please log in to view your documents.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-4xl font-bold">
              Documents
            </h1>

            <p className="mt-2 text-slate-400">
              Upload and manage your study material.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={uploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <Loader2
                size={20}
                className="animate-spin"
              />
            ) : (
              <Upload size={20} />
            )}

            {uploading
              ? "Uploading..."
              : "Upload document"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.ppt,.pptx,.txt"
            onChange={handleFileChange}
          />

        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="mt-6 rounded-xl border border-blue-900 bg-blue-950/40 px-4 py-3 text-sm text-blue-300">
            {message}
          </div>
        )}

        {/* Documents */}
        <div className="mt-8">

          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">

              <Loader2
                size={28}
                className="mr-3 animate-spin"
              />

              Loading documents...

            </div>
          ) : documents.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-20 text-center">

              <FileText
                size={48}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-5 text-xl font-semibold">
                No documents yet
              </h2>

              <p className="mt-2 text-slate-400">
                Upload your first study material.
              </p>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
              >
                Upload your first document
              </button>

            </div>

          ) : (

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {documents.map(
                (documentRecord) => {

                  const Icon =
                    getFileIcon(
                      documentRecord.file_type
                    );

                  return (
                    <div
                      key={documentRecord.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        {/* File information */}
                        <div className="flex min-w-0 items-center gap-4">

                          <div className="rounded-xl bg-blue-950 p-3 text-blue-400">
                            <Icon size={24} />
                          </div>

                          <div className="min-w-0">

                            <h3
                              className="truncate font-semibold"
                              title={documentRecord.name}
                            >
                              {documentRecord.name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {formatFileSize(
                                documentRecord.file_size
                              )}
                            </p>

                          </div>

                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleDownload(
                                documentRecord
                              )
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-950 hover:text-blue-400"
                            title="Download document"
                          >
                            <Download
                              size={19}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                documentRecord
                              )
                            }
                            disabled={
                              deletingId ===
                              documentRecord.id
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-950 hover:text-red-400 disabled:opacity-50"
                            title="Delete document"
                          >
                            {deletingId ===
                            documentRecord.id ? (
                              <Loader2
                                size={19}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2
                                size={19}
                              />
                            )}
                          </button>

                        </div>

                      </div>

                      <div className="mt-5 border-t border-slate-800 pt-4 text-xs text-slate-500">
                        {new Date(
                          documentRecord.created_at
                        ).toLocaleString()}
                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

      </div>
    </div>
  );
}