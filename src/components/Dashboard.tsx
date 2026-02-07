import React, { useEffect, useState, useRef } from 'react';
import { User, Stethoscope, Calendar } from 'lucide-react';
import { fetchClinicData } from '../services/api';
import { ClinicRecord } from '../types';

interface PatientView {
  id: string;
  fullName: string;
  doctorName: string;
  registrationTime: string;
  rawTimestamp: string;
}

const formatTimestamp = (ts: string) => {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const Dashboard: React.FC = () => {
  const [patients, setPatients] = useState<PatientView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const parseAndMap = (rows: ClinicRecord[]) => {
    const mapped = rows
      .map((r, idx) => {
        const raw = String(r.timestamp || '');
        return {
          id: `${raw}-${idx}`,
          fullName: String(r.patientName || 'غير معروف'),
          doctorName: String(r.doctorName || 'غير محدد'),
          registrationTime: formatTimestamp(raw),
          rawTimestamp: raw,
        } as PatientView;
      })
      .sort((a, b) => {
        const ta = Date.parse(a.rawTimestamp) || 0;
        const tb = Date.parse(b.rawTimestamp) || 0;
        return tb - ta; // newest first
      });

    return mapped;
  };

  const load = async () => {
    setLoading(true);
    try {
      const rows = await fetchClinicData();
      // Log fetched rows for debugging live updates
      console.log(`[Dashboard] fetched ${rows.length} rows at ${new Date().toISOString()}`);
      const mapped = parseAndMap(rows);
      // Log when parsed mapping changes counts
      console.log(`[Dashboard] mapped to ${mapped.length} patient views`);
      setPatients(mapped);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load and polling setup:
    // - Call `load()` once immediately to populate data on mount.
    // - Create an interval to call `load()` every 3 seconds to keep data live (within requested 3-5s).
    // - Store the interval id in a ref and clear it on unmount to avoid leaks.
    load();
    intervalRef.current = window.setInterval(load, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const todayCount = patients.filter(p => {
    const d = new Date(p.rawTimestamp);
    if (isNaN(d.getTime())) return false;
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }).length;

  return (
    <div className="w-full bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white animate-fadeIn">
      <div className="px-10 py-8 border-b border-white/5 bg-[#1256c4] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User size={26} className="text-[#3498db]" />
          <div>
            <div className="font-black text-xl">تتبع الحالات</div>
            <div className="text-sm text-white/80">عرض البيانات الحية من جدول Google</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/80">إجمالي اليوم</div>
          <div className="text-2xl font-black">{todayCount}</div>
        </div>
      </div>

      <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <div className="col-span-full text-center text-slate-400">جاري تحميل البيانات...</div>
        )}

        {error && (
          <div className="col-span-full text-center text-red-500">خطأ: {error}</div>
        )}

        {!loading && patients.length === 0 && !error && (
          <div className="col-span-full text-center text-slate-400">لا توجد بيانات متاحة</div>
        )}

        {patients.map((p, idx) => (
          <div key={p.id} className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-black text-slate-800">{p.fullName}</div>
              <div className="text-sm text-slate-400">#{idx + 1}</div>
            </div>
            <div className="text-sm text-slate-600 mb-3 flex items-center gap-3">
              <Stethoscope size={18} />
              <span className="font-bold">{p.doctorName}</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Calendar size={16} />
              <span>{p.registrationTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
