import React, { useEffect, useState, useRef } from 'react';
import { User, Stethoscope, Calendar, Hash } from 'lucide-react';
import { fetchClinicData } from '../services/api';
import { ClinicRecord } from '../types';

interface PatientView {
  id: string;
  fullName: string;
  doctorName: string;
  registrationTime: string;
}

const Dashboard: React.FC = () => {
  const [patients, setPatients] = useState<PatientView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const parseAndMap = (rows: ClinicRecord[]) => {
    const mapped = rows
      .map((r, idx) => {
        const date = new Date(r.timestamp);
        const reg = isNaN(date.getTime()) ? r.timestamp : date.toLocaleString('ar-EG', {
          year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        });
        return {
          id: `${r.timestamp}-${idx}`,
          fullName: r.patientName || 'غير معروف',
          doctorName: r.doctorName || 'غير محدد',
          registrationTime: reg,
        } as PatientView;
      })
      .sort((a, b) => {
        const ta = Date.parse(a.id.split('-')[0]) || 0;
        const tb = Date.parse(b.id.split('-')[0]) || 0;
        return tb - ta;
      });

    return mapped;
  };

  const load = async () => {
    setLoading(true);
    try {
      const rows = await fetchClinicData();
      const mapped = parseAndMap(rows);
      setPatients(mapped);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    intervalRef.current = window.setInterval(load, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const todayCount = patients.filter(p => {
    const raw = p.id.split('-')[0];
    const d = new Date(raw);
    if (isNaN(d.getTime())) return false;
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }).length;

  return (
    <div className="w-full bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white animate-fadeIn">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[#1256c4] text-white">
              <th className="px-10 py-8 font-black text-xl border-b border-white/5">
                <div className="flex items-center gap-3">
                  <User size={26} className="text-[#3498db]" />
                  <span>إسم المريض كامل</span>
                </div>
              </th>
              <th className="px-10 py-8 font-black text-xl border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Stethoscope size={26} className="text-[#3498db]" />
                  <span>إسم الطبيب المعالج</span>
                </div>
              </th>
              <th className="px-10 py-8 font-black text-xl border-b border-white/5 text-center">
                <div className="flex items-center justify-center gap-3">
                  <Calendar size={26} className="text-[#3498db]" />
                  <span>تاريخ تسجيل الحالة</span>
                </div>
              </th>
              <th className="px-10 py-8 font-black text-xl border-b border-white/5 text-center">
                <div className="flex items-center justify-center gap-3">
                  <Hash size={26} className="text-[#3498db]" />
                  <span>#</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-10 py-8 text-center text-slate-400">جاري تحميل البيانات...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={4} className="px-10 py-8 text-center text-red-500">خطأ: {error}</td>
              </tr>
            )}
            {!loading && patients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-10 py-8 text-center text-slate-400">لا توجد بيانات متاحة</td>
              </tr>
            )}
            {patients.map((patient, idx) => (
              <tr key={patient.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                <td className="px-10 py-8 text-lg font-bold text-slate-800">{patient.fullName}</td>
                <td className="px-10 py-8 text-lg font-bold text-slate-700">{patient.doctorName}</td>
                <td className="px-10 py-8 text-lg font-bold text-slate-600 text-center">{patient.registrationTime}</td>
                <td className="px-10 py-8 text-lg font-black text-[#1256c4] text-center bg-blue-50/20">{idx + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-10 py-8 bg-blue-50/30 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-lg font-black text-slate-600">
            إجمالي اليوم: <span className="text-[#1256c4] text-2xl">{todayCount}</span>
          </div>
        </div>
        <div className="text-sm text-slate-400 font-bold">آخر تحديث: منذ لحظات</div>
      </div>
    </div>
  );
};

export default Dashboard;
