import React from 'react';
import { useAuth } from './context/AuthContext';
import AuthPages from './components/AuthPages';
import MainLayout from './components/MainLayout';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 transition-colors duration-300">
      {user ? <MainLayout /> : <AuthPages />}
    </div>
  );
}

export default App;
