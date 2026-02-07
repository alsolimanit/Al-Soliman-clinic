import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DoctorsSection from './components/DoctorsSection';
import { Doctor } from './types';

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

  const sampleDoctors: Doctor[] = [
    { id: '1', name: 'د. أحمد محمد', specialty: 'طب عام', patientCount: 12, status: 'active' },
    { id: '2', name: 'د. فاطمة علي', specialty: 'أمراض النساء', patientCount: 8, status: 'active' },
    { id: '3', name: 'د. محمود سالم', specialty: 'الأطفال', patientCount: 15, status: 'active' }
  ];

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
          <div className="mt-16">
            <DoctorsSection doctors={sampleDoctors} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
