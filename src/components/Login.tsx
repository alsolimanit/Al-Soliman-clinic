import React, { useState } from 'react';
import { Building2, Lock, User, LogIn, ShieldAlert } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === 'admin' || username === 'it') && password === 'العيادات') {
      onLogin();
    } else {
      setError('خطأ في اسم المستخدم أو كلمة المرور');
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f4f9] flex items-center justify-center p-6 font-['Cairo']" dir="rtl">
      <div className="max-w-[1000px] w-full bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-white">
        <div className="md:w-1/2 bg-[#1256c4] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/20">
              <Building2 size={48} className="text-white" />
            </div>
            <h1 className="text-4xl font-black mb-6 leading-tight">
              نظام إدارة العيادات <br />
              <span className="text-[#3498db]">مستشفى آل سليمان</span>
            </h1>
            <p className="text-blue-100/70 text-lg font-bold leading-relaxed">يرجى تسجيل الدخول للوصول إلى لوحة المراقبة والتحكم المركزية.</p>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-8 mt-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <ShieldAlert size={20} className="text-[#3498db]" />
              </div>
              <p className="text-xs font-bold opacity-60">النظام محمي ومراقب أمنياً</p>
            </div>
            <p className="text-sm font-black text-white/90">برمجة مهندس محمد الصياد</p>
            <p className="text-[9px] font-medium text-white/40 mt-1">Gang Technology</p>
          </div>

          <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-[#3498db]/20 rounded-full blur-3xl"></div>
        </div>

        <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-right">
            <h2 className="text-3xl font-black text-[#1256c4] mb-2">تسجيل الدخول</h2>
            <p className="text-slate-400 font-bold">أدخل بيانات الاعتماد الخاصة بك</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 mr-2">اسم المستخدم</label>
              <div className="relative group">
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1256c4] transition-colors">
                  <User size={20} />
                </div>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#f8fafc] border-2 border-slate-100 rounded-2xl py-4 pr-14 pl-6 text-lg font-bold focus:border-[#1256c4] focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 mr-2">كلمة المرور</label>
              <div className="relative group">
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1256c4] transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f8fafc] border-2 border-slate-100 rounded-2xl py-4 pr-14 pl-6 text-lg font-bold focus:border-[#1256c4] focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-black border border-red-100 flex items-center gap-3 animate-shake">
                <ShieldAlert size={18} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#1256c4] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 hover:shadow-blue-900/40 transition-all hover:translate-y-[-2px] active:translate-y-[0px] flex items-center justify-center gap-3 mt-8"
            >
              <LogIn size={22} />
              <span>دخول</span>
            </button>
          </form>

          <p className="text-xs text-slate-400 font-bold mt-8 text-center">بيانات تجريبية: اسم المستخدم: admin | كلمة المرور: العيادات</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
