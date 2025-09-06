'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ChatProps {
  docId?: string;
}

export default function Chat({ docId }: ChatProps) {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of chat on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    // Add user question to conversation
    setConversation(prev => [...prev, { role: 'user', content: question }]);
    
    // Clear input
    setQuestion('');
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'pdf_qa_dev_secret_key' // Use the same value as in .env.example
        },
        body: JSON.stringify({
          question,
          docId, // Include docId if available
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add assistant response to conversation
      setConversation(prev => [...prev, { role: 'assistant', content: data.answer }]);
      
    } catch (error: any) {
      console.error('Error asking question:', error);
      // Add error message to conversation
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message || 'Failed to get an answer'}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[800px] max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-t-lg shadow-inner">
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <svg className="w-16 h-16 mb-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <p className="text-center text-lg font-medium">
              Ask a question about your PDF document
            </p>
            {!docId && (
              <p className="mt-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-md font-medium border border-amber-200">
                No document is currently loaded. Please upload a PDF first.
              </p>
            )}
          </div>
        ) : (
          conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-50 border border-blue-100 ml-auto max-w-[80%] text-blue-900' 
                  : 'bg-white border border-gray-100 max-w-[80%] text-slate-800'
              }`}
            >
              <p className="text-sm font-bold mb-2 flex items-center">
                {msg.role === 'user' ? (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                    <span>You</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                    </svg>
                    <span>AI Assistant</span>
                  </>
                )}
              </p>
              <p className="whitespace-pre-wrap text-base leading-relaxed">{msg.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
        <div className="flex">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your PDF..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className={`px-6 py-3 rounded-r-lg font-medium text-white flex items-center justify-center min-w-[100px] ${
              isLoading || !question.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </span>
            ) : 'Send'}
          </button>
        </div>
        {!docId && (
          <p className="mt-2 text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-100">
            Warning: No document ID provided. The assistant may not have context to answer your questions.
          </p>
        )}
      </form>
    </div>
  );
}
