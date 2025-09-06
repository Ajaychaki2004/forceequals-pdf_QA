import { readFile } from "fs/promises";
import PDFParse from "pdf-parse";

export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const data = await PDFParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF file");
  }
}

export async function extractTextFromPDFPath(pdfPath: string): Promise<string> {
  try {
    const pdfBuffer = await readFile(pdfPath);
    return extractTextFromPDF(pdfBuffer);
  } catch (error) {
    console.error("Error reading PDF file:", error);
    throw new Error("Failed to read PDF file");
  }
}
