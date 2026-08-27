import { useState } from "react";
import { extractText } from "../../services/extraction/textExtractor";

export default function ExtractionTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleExtract() {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setText("");

      const extractedText = await extractText(file);

      setText(extractedText);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Text extraction failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold">
          Document Extraction Test
        </h1>

        <p className="mt-2 text-slate-400">
          Temporary development tool for testing text extraction.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(event) => {
              setFile(
                event.target.files?.[0] ?? null
              );

              setText("");
              setError("");
            }}
            className="block w-full text-sm text-slate-300"
          />

          {file && (
            <p className="mt-4 text-sm text-slate-400">
              Selected:{" "}
              <span className="text-white">
                {file.name}
              </span>
            </p>
          )}

          <button
            type="button"
            onClick={handleExtract}
            disabled={!file || loading}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Extracting..."
              : "Extract text"}
          </button>

        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-300">
            {error}
          </div>
        )}

        {text && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Extracted Text
              </h2>

              <span className="text-sm text-slate-500">
                {text.length.toLocaleString()} characters
              </span>
            </div>

            <pre className="mt-5 max-h-[600px] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-5 text-sm leading-6 text-slate-300">
              {text}
            </pre>

          </div>
        )}

      </div>
    </div>
  );
}