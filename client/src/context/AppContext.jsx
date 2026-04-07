import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [technology, setTechnology] = useState('HTML + CSS + JS');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const generateCode = async (prompt) => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setChatHistory(prev => [...prev, { role: 'user', content: prompt }]);

    try {
      const response = await axios.post(`${API_BASE}/generator/generate`, {
        prompt,
        technology,
        user_id: user?._id
      });

      const newCode = response.data.code;
      setGeneratedCode(newCode);
      setChatHistory(prev => [...prev, { role: 'ai', content: `Heres your ${technology} code! Check the preview tab.` }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please check the server connection.' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchHistory = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`${API_BASE}/generator/history/${user._id}`);
      // Not displaying full history in chat yet, but could be used for a sidebar
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  return (
    <AppContext.Provider value={{ 
      technology, 
      setTechnology, 
      generatedCode, 
      isGenerating, 
      generateCode,
      chatHistory
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
