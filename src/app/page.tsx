import Image from "next/image";
import PDFUploader from "@/components/PDFUploader";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <header className="mb-12 text-center">
          <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            AI-Powered Document Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 leading-tight">
            PDF Q&A <span className="text-blue-600">Application</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Upload a PDF document and ask questions about its content using 
            OpenAI's powerful language models. Get precise answers in seconds.
          </p>
        </header>

        <PDFUploader />
        
        <div className="mt-16 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            How It Works
          </h2>
          <ol className="space-y-6">
            {[
              {
                title: 'Upload your PDF document',
                description: 'Simply drag and drop or browse to select any PDF document you want to analyze.'
              },
              {
                title: 'AI processes your document',
                description: 'Our system extracts text and creates searchable embeddings using OpenAI technology.'
              },
              {
                title: 'Ask questions in natural language',
                description: 'Use the chat interface to ask any question about your document content.'
              },
              {
                title: 'Get accurate, contextual answers',
                description: "Receive answers based specifically on your document's content, with relevant context."
              }
            ].map((step, index) => (
              <li key={index} className="flex">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-blue-600 font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">{step.title}</h3>
                  <p className="mt-1 text-slate-600">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      
      <footer className="mt-16 text-center text-sm text-slate-500 pb-8 border-t border-slate-200 pt-8 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <p className="flex items-center justify-center">
            Built with 
            <span className="mx-2 px-2 py-1 bg-black text-white rounded font-medium">Next.js</span> 
            <span className="mx-2 px-2 py-1 bg-green-600 text-white rounded font-medium">OpenAI</span> and 
            <span className="mx-2 px-2 py-1 bg-purple-600 text-white rounded font-medium">Qdrant</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
