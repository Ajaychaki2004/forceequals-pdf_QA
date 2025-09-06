import { QdrantClient } from "@qdrant/qdrant-js";

// In a Node.js script context, load environment variables if needed
if (typeof process !== "undefined" && !process.env.NEXT_RUNTIME) {
  // Only load dotenv in script context, not in Next.js server
  try {
    require("dotenv").config({ path: '.env.local' });
  } catch (e) {
    console.warn("Could not load dotenv, assuming environment variables are set");
  }
}

// Create client with optimized settings
export const qdrant = new QdrantClient({
  url: "https://a34268c3-aa86-4215-9c60-7ca34fd334b9.us-west-2-0.aws.cloud.qdrant.io:6333",
  apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.AG_RaPJX3u3g-aLlLHr6Wja09J0_xZivyIMTLIvpEJE",
  
  // Performance and reliability settings
  checkCompatibility: false, // Skip version compatibility check
  timeout: 10000, // 10-second timeout
});
