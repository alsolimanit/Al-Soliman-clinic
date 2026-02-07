import React from 'react';
import { UserCheck, Award, TrendingUp } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorsSectionProps {
  doctors: Doctor[];
}

const DoctorsSection: React.FC<DoctorsSectionProps> = ({ doctors }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-[#002366]">الفريق الطبي الحالي</h2>
          <p className="text-slate-400 text-sm font-medium">إحصائيات الضغط الفعلي للعيادات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-300 relative group">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#002366] rounded-2xl flex items-center justify-center text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
              <TrendingUp size={24} />
            </div>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-[#E0F7FA] rounded-full flex items-center justify-center text-[#002366] mb-4 border-4 border-white shadow-inner">
                <UserCheck size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-800">{doctor.name}</h3>
              <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">{doctor.specialty}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl text-center border border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">المرضى</p>
                <p className="text-2xl font-black text-[#002366]">{doctor.patientCount}</p>
              </div>
              <div className="bg-[#F8FAFC] p-4 rounded-2xl text-center border border-slate-50 flex flex-col items-center justify-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">الحالة</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-[10px] font-black text-green-600">نشط</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-8 py-3.5 bg-[#002366] text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-900/10 hover:shadow-blue-900/30 transition-all">
              إدارة كشوفات العيادة
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-[#002366] to-[#00153D] rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-black mb-4 leading-tight">دقة البيانات بنسبة 100%</h3>
            <p className="text-blue-100/70 text-base font-medium leading-relaxed">
              هذا النظام متصل مباشرة بقاعدة البيانات السحابية (Google Spreadsheet). يتم تحديث كافة الإحصائيات والأرقام المعروضة تلقائياً فور إدخال أي مريض جديد في العيادات.
            </p>
          </div>
          <div className="flex justify-center md:justify-end gap-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl text-center border border-white/10 w-32">
              <p className="text-[10px] font-bold opacity-60 uppercase mb-1">تحديث</p>
              <p className="text-2xl font-black">لحظي</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl text-center border border-white/10 w-32">
              <p className="text-[10px] font-bold opacity-60 uppercase mb-1">الأمان</p>
              <p className="text-2xl font-black">عالي</p>
            </div>
          </div>
        </div>
        <div className="absolute right-[-100px] top-[-100px] w-[500px] h-[500px] bg-blue-400 opacity-5 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default DoctorsSection;
