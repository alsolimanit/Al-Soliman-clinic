import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
// Removed DoctorsSection and any hardcoded sample data to rely solely on real API

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    if (savedLoginState === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };


  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div dir="rtl" className="bg-[#f1f4f9] min-h-screen font-['Cairo']">
      <Sidebar />
      <div className="mr-64 flex flex-col">
        <Header />
        <main className="flex-1 p-10 space-y-10 overflow-y-auto">
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-[#002366]">تتبع المرضى والعيادات</h2>
            <Dashboard />
          </div>
          {/* DoctorsSection removed to avoid hardcoded/mock data. Dashboard shows live data only. */}
        </main>
      </div>
    </div>
  );
};

export default App;
