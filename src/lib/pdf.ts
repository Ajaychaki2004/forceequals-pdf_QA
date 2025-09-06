// A simple PDF text extractor without external dependencies
// This avoids issues with pdf-parse trying to access hardcoded file paths

export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    // Convert buffer to string for basic text extraction
    const pdfString = pdfBuffer.toString('utf8');
    
    // Extract text using simple pattern matching
    let extractedText = extractTextFromPDFString(pdfString);
    
    if (!extractedText || extractedText.trim().length === 0) {
      // Fallback to ASCII extraction if UTF-8 fails
      extractedText = extractTextFromPDFBytes(pdfBuffer);
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("Could not extract text from PDF");
    }
    
    return extractedText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(`Failed to extract text from PDF: ${(error as Error).message}`);
  }
}

// Extract text from PDF string using regex patterns
function extractTextFromPDFString(pdfString: string): string {
  let text = "";
  
  try {
    // Look for text objects in PDF content
    // PDF text typically appears between "BT" (Begin Text) and "ET" (End Text) markers
    const textMatches = pdfString.match(/BT[\s\S]*?ET/g);
    
    if (textMatches) {
      for (const match of textMatches) {
        // Extract text from various formats that appear in PDFs
        const cleaned = match
          .replace(/BT|ET/g, " ")
          .replace(/\[\(([^\)]*)\)\]/g, "$1") // [(text)]
          .replace(/\(([^\)]*)\) Tj/g, "$1")  // (text) Tj
          .replace(/\\(\d{3})/g, (m, code) => String.fromCharCode(parseInt(code, 8))) // Octal escapes
          .replace(/\\n|\\r/g, " ")
          .replace(/\s+/g, " ");
          
        text += cleaned + " ";
      }
    }
    
    return text.trim();
  } catch (e) {
    console.warn("Error in PDF text extraction:", e);
    return "";
  }
}

// Fallback extraction by scanning for ASCII text
function extractTextFromPDFBytes(buffer: Buffer): string {
  let text = "";
  let inText = false;
  let currentWord = "";
  
  try {
    // Scan for printable ASCII characters
    for (let i = 0; i < buffer.length; i++) {
      const byte = buffer[i];
      
      // Printable ASCII range and common punctuation
      if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
        const char = String.fromCharCode(byte);
        
        if (!inText && /[a-zA-Z0-9]/.test(char)) {
          inText = true;
        }
        
        if (inText) {
          currentWord += char;
        }
      } else if (inText) {
        // End of a text section
        if (currentWord.length > 3) { // Only include if it looks like actual text
          text += currentWord + " ";
        }
        currentWord = "";
        inText = false;
      }
    }
    
    // Add the last word if needed
    if (inText && currentWord.length > 3) {
      text += currentWord;
    }
    
    return text.trim();
  } catch (e) {
    console.warn("Error in PDF byte scanning:", e);
    return "";
  }
}

// We've removed the extractTextFromPDFPath function as it's not needed for the web API
// and it relied on filesystem operations that could cause issues
