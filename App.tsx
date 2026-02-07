
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (savedLogin === 'true') setIsLoggedIn(true);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-['Cairo'] overflow-hidden" dir="rtl">
      <Sidebar />

      <main className="flex-1 flex flex-col mr-64 h-screen overflow-hidden">
        <Header />

        <div className="flex-1 p-10 overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <Dashboard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
