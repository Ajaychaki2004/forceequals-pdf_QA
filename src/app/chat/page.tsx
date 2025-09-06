'use client';

import { useSearchParams } from 'next/navigation';
import Chat from '@/components/Chat';
import Link from 'next/link';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const docId = searchParams.get('docId');
  
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-blue-50 to-slate-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">PDF Q&A Chat</h1>
            <p className="text-slate-600 mt-1">Ask questions about your document and get intelligent answers</p>
          </div>
          <Link 
            href="/" 
            className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center md:justify-start whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Upload New PDF
          </Link>
        </div>
        
        {docId ? (
          <div className="mb-4 bg-green-50 text-green-800 p-4 rounded-md border border-green-200 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <div>
              <span className="font-medium">Document loaded successfully</span>
              <span className="ml-2 text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs font-mono">ID: {docId.substring(0, 8)}...</span>
            </div>
          </div>
        ) : (
          <div className="mb-4 bg-yellow-50 text-yellow-800 p-4 rounded-md border border-yellow-200 flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <div>
              <span className="font-medium">No document loaded.</span> Please <Link href="/" className="underline font-bold text-blue-700 hover:text-blue-800">upload a PDF</Link> first for best results.
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-xl h-[70vh] border border-gray-200">
          <Chat docId={docId || undefined} />
        </div>
      </div>
    </div>
  );
}
