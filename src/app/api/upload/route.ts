import { NextRequest, NextResponse } from "next/server";
// Import our PDF extractor function
import { extractTextFromPDF } from "@/lib/pdf";
import { generateEmbeddings, splitTextIntoChunks } from "@/lib/openai";
import { qdrant } from "@/lib/qdrant";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Check API key
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== 'pdf_qa_dev_secret_key') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const pdfFile = formData.get("pdf") as File;
    
    if (!pdfFile) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    // Generate a document ID
    const docId = randomUUID();
    
    // Convert File to Buffer
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    
    // Extract text from PDF
    let text = "";
    try {
      // Use our custom PDF extractor
      text = await extractTextFromPDF(pdfBuffer);
    } catch (error) {
      console.error("Failed to extract text from PDF:", error);
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }
    
    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }
    
    // Split text into manageable chunks
    const chunks = splitTextIntoChunks(text);
    
    // Generate embeddings and store in Qdrant
    try {
      const points = await Promise.all(
        chunks.map(async (chunk, index) => {
          try {
            const embedding = await generateEmbeddings(chunk);
            
            // Convert to numeric ID for Qdrant compatibility
            const numericId = parseInt(`${Date.now()}${index}`.slice(-9));
            
            return {
              id: numericId,
              vector: embedding,
              payload: {
                docId,
                filename: pdfFile.name,
                chunkIndex: index,
                content: chunk,
              }
            };
          } catch (embeddingError) {
            console.error(`Error generating embedding for chunk ${index}:`, embeddingError);
            throw new Error(`Failed to generate embedding: ${(embeddingError as Error).message}`);
          }
        })
      );
      
      // Store in Qdrant
      await qdrant.upsert("pdf_chunks", { points: points });
    } catch (error) {
      console.error("Error processing embeddings:", error);
      throw error;
    }
    
    return NextResponse.json({ 
      success: true, 
      docId,
      chunkCount: chunks.length,
    });
    
  } catch (error: any) {
    console.error("Error processing PDF:", error);
    return NextResponse.json({ error: error.message || "Failed to process PDF" }, { status: 500 });
  }
}

// Set maximum file size to 10MB
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
