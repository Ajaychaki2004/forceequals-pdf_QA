'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PDFUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [docId, setDocId] = useState<string | null>(null);
  
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploadStatus('');
    } else {
      setFile(null);
      setUploadStatus('Please select a valid PDF file');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setUploadStatus('Please select a PDF file first');
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus('Processing PDF...');
      
      const formData = new FormData();
      formData.append('pdf', file);

      let response;
      
      try {
        // First try the regular upload endpoint
        response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'x-api-key': 'pdf_qa_dev_secret_key' 
          }
        });
        
        if (!response.ok) {
          console.warn("Regular upload failed, trying fallback endpoint...");
          throw new Error("Regular upload failed");
        }
      } catch (uploadError) {
        // If regular upload fails, try the test-upload endpoint as fallback
        console.log("Using fallback upload endpoint...");
        
        try {
          response = await fetch('/api/test-upload', {
            method: 'POST',
            body: formData,
            headers: {
              'x-api-key': 'pdf_qa_dev_secret_key'
            }
          });
          
          if (!response.ok) {
            // Get error details from response
            const errorData = await response.json();
            console.error("Test upload failed with details:", errorData);
            throw new Error(`Upload failed with status: ${response.status} - ${errorData.error || 'Unknown error'}`);
          }
        } catch (testUploadError) {
          console.error("Both upload methods failed:", testUploadError);
          throw testUploadError;
        }
      }

      const data = await response.json();
      setDocId(data.docId);
      setUploadStatus(`PDF processed successfully! ${data.chunkCount} chunks created.`);
      
      // Redirect to the chat page with the document ID
      router.push(`/chat?docId=${data.docId}`);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus(`Error: ${error.message || 'Failed to upload PDF'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Upload a PDF Document</h2>
      
      <form onSubmit={handleUpload} className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-xl p-8 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 cursor-pointer">
          <label htmlFor="pdf-upload" className="cursor-pointer w-full">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              <span className="mt-2 text-xl font-semibold text-slate-800">
                {file ? file.name : 'Drop your PDF here or click to browse'}
              </span>
              <span className="mt-2 text-sm text-slate-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
                Maximum file size: 10MB
              </span>
            </div>
            <input
              id="pdf-upload"
              name="pdf"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        
        {uploadStatus && (
          <div className={`p-4 rounded-lg text-base font-medium shadow-sm ${
            uploadStatus.includes('Error') 
              ? 'bg-red-50 text-red-800 border border-red-200' 
              : uploadStatus.includes('successfully') 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <div className="flex items-center">
              {uploadStatus.includes('Error') && (
                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
              )}
              {uploadStatus.includes('successfully') && (
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              )}
              {!uploadStatus.includes('Error') && !uploadStatus.includes('successfully') && (
                <svg className="w-5 h-5 mr-2 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {uploadStatus}
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!file || isUploading}
            className={`px-8 py-3 rounded-lg text-white font-medium text-lg shadow-sm transition-all ${
              !file || isUploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow'
            }`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Upload & Analyze'}
          </button>
        </div>
      </form>
    </div>
  );
}
