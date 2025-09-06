# PDF Q&A Application

This application allows users to upload PDF documents and ask questions about their content using OpenAI's language models and RAG (Retrieval-Augmented Generation) approach.

## Features

- PDF document upload and text extraction
- Vector embedding generation using OpenAI's text-embedding-3-large model
- Storage of text chunks and embeddings in Qdrant vector database
- Question answering based on the content of the uploaded PDFs
- Simple and intuitive user interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI's API (embeddings and GPT models)
- **Vector Database**: Qdrant
- **PDF Processing**: pdf-lib

## Prerequisites

- Node.js 18.17 or later
- An OpenAI API key
- A Qdrant database instance (local or cloud)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/pdf-qa.git
cd pdf-qa
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` to include your:
- OpenAI API key
- Qdrant URL and API key (if using cloud instance)
- API secret for backend route protection

4. Initialize the Qdrant collection:

```bash
npx tsx scripts/init-qdrant.ts
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.

## How it Works

1. **PDF Upload**: The user uploads a PDF file through the frontend interface.

2. **Text Extraction**: The backend extracts text from the PDF using a custom extraction algorithm that handles PDF text formats without external dependencies.

3. **Text Chunking**: The extracted text is split into manageable chunks for processing.

4. **Embedding Generation**: Each text chunk is converted into a vector embedding using OpenAI's text-embedding-3-large model.

5. **Vector Storage**: The embeddings and corresponding text chunks are stored in the Qdrant vector database.

6. **Question Processing**: When a user asks a question, the application:
   - Converts the question to an embedding
   - Searches the vector database for similar content
   - Retrieves the most relevant text chunks
   - Sends the question and context to OpenAI's model
   - Returns the generated answer to the user

## API Routes

- `POST /api/upload`: Upload and process a PDF file
- `POST /api/question`: Ask a question about a PDF document

## Implementation Details

### Vector Database
Qdrant is used as the vector database to store and retrieve text embeddings efficiently. The collection is created with a dimensionality of 1536, which matches the output of OpenAI's text-embedding-3-large model.

### Text Chunking
The PDF text is divided into manageable chunks to optimize embedding generation and retrieval. This approach ensures that the context provided to the language model is relevant and focused.

### Security
API routes are protected using an API key mechanism to prevent unauthorized access.

## Future Improvements

- Support for multiple file formats beyond PDF
- User authentication and document management
- Batch processing for large documents
- Highlighting relevant sections in the PDF viewer
