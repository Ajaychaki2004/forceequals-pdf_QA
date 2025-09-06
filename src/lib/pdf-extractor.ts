// Custom implementation to avoid reliance on pdf-parse's default behavior
// This is a simplified version that will extract text from PDF buffer without using pdf-parse

export async function extractTextFromPDFBuffer(pdfBuffer: Buffer): Promise<string> {
  try {
    // Try multiple approaches to extract text
    
    // Approach 1: UTF-8 decoding
    try {
      const decoder = new TextDecoder('utf-8');
      const bufferString = decoder.decode(pdfBuffer);
      const textContent = extractTextFromPDFString(bufferString);
      
      if (textContent && textContent.trim().length > 0) {
        return textContent;
      }
    } catch (e) {
      console.warn("UTF-8 decoding approach failed:", e);
    }
    
    // Approach 2: Latin1 decoding (for older PDFs)
    try {
      const decoder = new TextDecoder('iso-8859-1');
      const bufferString = decoder.decode(pdfBuffer);
      const textContent = extractTextFromPDFString(bufferString);
      
      if (textContent && textContent.trim().length > 0) {
        return textContent;
      }
    } catch (e) {
      console.warn("Latin1 decoding approach failed:", e);
    }
    
    // Approach 3: Extract any printable ASCII characters
    try {
      // Convert buffer to string and extract any printable ASCII characters
      let asciiText = "";
      for (let i = 0; i < pdfBuffer.length; i++) {
        const byte = pdfBuffer[i];
        // Only include printable ASCII characters
        if (byte >= 32 && byte <= 126) {
          asciiText += String.fromCharCode(byte);
        } else if (byte === 10 || byte === 13) { // Add newlines
          asciiText += "\n";
        }
      }
      
      // Clean up the text
      asciiText = asciiText
        .replace(/[^\w\s.,?!:;()\-"']/g, " ")  // Remove non-text characters
        .replace(/\s+/g, " ")                  // Normalize whitespace
        .trim();
      
      if (asciiText.length > 100) { // Only return if we got substantial text
        return asciiText;
      }
    } catch (e) {
      console.warn("ASCII extraction approach failed:", e);
    }
    
    throw new Error("Could not extract meaningful text from PDF using any method");
  } catch (error) {
    console.error("Error processing PDF buffer:", error);
    throw new Error("Failed to process PDF content: " + (error as Error).message);
  }
}

// Helper function to extract text from PDF string
function extractTextFromPDFString(pdfString: string): string {
  let extractedText = "";
  
  try {
    // Get text between BT (Begin Text) and ET (End Text) markers in PDF
    // Use a regex that works with ES2017 (no 's' flag)
    const textRegex = /BT\s*([^]*?)\s*ET/g;
    let textMatch;
    
    // Extract all text segments
    while ((textMatch = textRegex.exec(pdfString)) !== null) {
      if (textMatch[1]) {
        // Clean up the extracted text
        const cleanedText = textMatch[1]
          .replace(/\\\(/g, "(")
          .replace(/\\\)/g, ")")
          .replace(/\\n/g, "\n")
          .replace(/\s+/g, " ")
          .replace(/\[\s*(.*?)\s*\]\s*TJ/g, "$1")
          .replace(/\(\s*(.*?)\s*\)\s*Tj/g, "$1");
        
        extractedText += cleanedText + "\n";
      }
    }
    
    // If we couldn't extract text with BT/ET markers, try a different approach
    if (!extractedText.trim()) {
      // Look for text streams
      // Use a regex that works with ES2017 (no 's' flag)
      const streamRegex = /stream\s*([^]*?)\s*endstream/g;
      let streamMatch;
      
      while ((streamMatch = streamRegex.exec(pdfString)) !== null) {
        if (streamMatch[1]) {
          extractedText += streamMatch[1] + "\n";
        }
      }
    }
    
    return extractedText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF string:", error);
    return "";
  }
}
