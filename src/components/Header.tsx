import React, { useState, useEffect } from 'react';
import { Bell, Activity } from 'lucide-react';

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
  };

  return (
    <header className="h-32 px-10 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-slate-200/50">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="bg-[#1256c4] p-2 rounded-lg shadow-lg shadow-blue-200">
            <Activity size={24} className="text-white animate-pulse" />
          </div>
          <h1 className="text-4xl font-[900] text-[#1256c4] tracking-tight drop-shadow-sm">
            نظام إدارة العيادات - مستشفى آل سليمان
          </h1>
        </div>
        <p className="text-slate-400 font-bold text-sm mr-12">منصة المراقبة الذكية وإدارة تدفق المرضى</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="bg-white border-2 border-[#1256c4]/10 text-[#1256c4] px-8 py-3 rounded-2xl flex items-center gap-6 shadow-xl shadow-blue-900/5 transition-all hover:shadow-blue-900/10">
           <div className="relative">
             <Bell size={24} className="text-[#1256c4] fill-[#1256c4]/10" />
             <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></span>
           </div>
           <div className="flex items-center gap-4 text-xl font-black border-r-2 border-slate-100 pr-6" dir="ltr">
             <span className="text-slate-400 text-sm">التاريخ:</span>
             <span className="text-slate-700">{formatDate(time)}</span>
             <div className="w-px h-6 bg-slate-200 mx-2"></div>
             <span className="text-slate-400 text-sm">الوقت:</span>
             <span className="bg-[#1256c4] text-white px-4 py-1 rounded-xl shadow-inner tabular-nums">
               {time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
             </span>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
