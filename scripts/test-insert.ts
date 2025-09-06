import { qdrant } from "../lib/qdrant";
import { randomUUID } from "crypto";

async function main() {
  console.log("Starting test insert...");
  console.log("QDRANT_URL:", process.env.QDRANT_URL);
  console.log("QDRANT_API_KEY length:", process.env.QDRANT_API_KEY?.length || 0);
  
  const id = randomUUID();

  // A fake 1536-dim vector (OpenAI embeddings normally produce these)
  const vector = Array(1536).fill(0).map((_, i) => Math.random());

  await qdrant.upsert("pdf_chunks", {
    points: [
      {
        id,
        vector,
        payload: {
          docId: "test-doc-1",
          filename: "dummy.pdf",
          pageNo: 1,
          chunkIndex: 0,
          content: "This is a dummy chunk for testing Qdrant integration."
        }
      }
    ]
  });

  console.log("✅ Inserted test point with id:", id);
}

main().catch(console.error);
