import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

export async function extractText(
  file: File
): Promise<string> {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

  switch (extension) {
    case "txt":
      return extractTxt(file);

    case "pdf":
      return extractPdf(file);

    case "docx":
      return extractDocx(file);

    default:
      throw new Error(
        `Text extraction is not supported for .${extension ?? "unknown"} files yet.`
      );
  }
}

async function extractTxt(
  file: File
): Promise<string> {
  return await file.text();
}

async function extractPdf(
  file: File
): Promise<string> {
  const buffer =
    await file.arrayBuffer();

  const pdf =
    await pdfjsLib.getDocument({
      data: buffer,
    }).promise;

  const pages: string[] = [];

  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber++
  ) {
    const page =
      await pdf.getPage(pageNumber);

    const content =
      await page.getTextContent();

    const text = content.items
      .map((item) =>
        "str" in item
          ? item.str
          : ""
      )
      .join(" ");

    pages.push(text);
  }

  return pages.join("\n\n");
}

async function extractDocx(
  file: File
): Promise<string> {
  const buffer =
    await file.arrayBuffer();

  const result =
    await mammoth.extractRawText({
      arrayBuffer: buffer,
    });

  return result.value;
}