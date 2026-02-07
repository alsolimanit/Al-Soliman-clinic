import React from 'react';
import { LayoutDashboard, Building2, ShieldCheck, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
  };

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-[#1256c4] flex flex-col z-50 text-white shadow-2xl">
      <div className="p-10 flex flex-col items-center border-b border-white/5 bg-[#0e48a5]">
        <div className="mb-6 bg-white/10 p-4 rounded-[2rem] backdrop-blur-sm border border-white/20">
          <Building2 size={60} strokeWidth={1.5} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-center leading-tight tracking-tight">
          مستشفى آل سليمان
        </h1>
        <div className="flex items-center gap-1.5 mt-4 text-[#3498db]">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">النظام الموحد</span>
        </div>
      </div>

      <nav className="flex-1 px-6 mt-10">
        <div className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-[#3498db] text-white shadow-xl shadow-[#1256c4]/50 border border-white/10 mb-6">
          <div className="flex items-center gap-4">
             <LayoutDashboard size={24} />
             <span className="font-black text-lg">لوحة المتابعة</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 transition-all text-white/70 hover:text-white"
        >
          <LogOut size={24} />
          <span className="font-bold">تسجيل الخروج</span>
        </button>

        <p className="mt-20 text-[11px] text-white/30 font-bold px-4 leading-relaxed">
          نظام المتابعة اللحظي للعيادات. جميع الحقوق محفوظة لمستشفى آل سليمان.
        </p>
      </nav>

      <div className="p-8 text-center border-t border-white/5 bg-[#0e48a5]">
        <p className="text-xs font-black text-white/80 mb-2 leading-tight">برمجة مهندس محمد الصياد</p>
        <p className="text-[10px] font-medium text-white/40 mb-3" dir="ltr">© Dev. Mohamed El-Sayyad</p>
        <div className="inline-block px-3 py-1 bg-white/5 rounded-full border border-white/5">
          <p className="text-[8px] font-bold text-white/30 tracking-[0.1em]">Gang Technology</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
