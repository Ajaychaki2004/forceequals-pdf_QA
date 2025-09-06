import { qdrant } from "../lib/qdrant";

async function main() {
  // Make a random query vector (normally you'd use an embedding)
  const queryVector = Array(1536).fill(0).map((_, i) => Math.random());

  const res = await qdrant.search("pdf_chunks", {
    vector: queryVector,
    limit: 3,
  });

  console.log("🔍 Search results:", res);
}

main().catch(console.error);
