import React, { useEffect, useState, useRef } from 'react';
import { User, Stethoscope, Calendar } from 'lucide-react';
import { fetchClinicData, deleteClinicRecords } from '../services/api';
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

  // Notification helpers
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const notifyTimerRef = useRef<number | null>(null);
  const prevPatientsRef = useRef<PatientView[]>([]);

  const showNotification = (msg: string) => {
    setNotification({ message: msg, visible: true });
    if (notifyTimerRef.current) clearTimeout(notifyTimerRef.current);
    notifyTimerRef.current = window.setTimeout(() => setNotification({ message: '', visible: false }), 4000);
  };

  const playTone = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 1000;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => { o.stop(); ctx.close(); }, 250);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };

  const load = async () => {
    // Prevent overlapping fetches: if a fetch is still in progress, skip this interval.
    if ((window as any).__isFetchingClinicData) return;
    (window as any).__isFetchingClinicData = true;
    setLoading(true);
    try {
      const rows = await fetchClinicData();
      // Log fetched rows for debugging live updates
      console.log(`[Dashboard] fetched ${rows.length} rows at ${new Date().toISOString()}`);
      const mapped = parseAndMap(rows);
      // Log when parsed mapping changes counts
      console.log(`[Dashboard] mapped to ${mapped.length} patient views`);
      // detect new entries and notify (only after initial load)
      const prev = prevPatientsRef.current || [];
      const prevIds = new Set(prev.map(p => p.id));
      const newItems = mapped.filter(p => !prevIds.has(p.id));
      if (newItems.length > 0 && prev.length > 0) {
        playTone();
        showNotification(`تم تسجيل حجز جديد (${newItems.length})`);
      }
      setPatients(mapped);
      prevPatientsRef.current = mapped;
      setError(null);
    } catch (e: any) {
      // Keep previous `patients` intact; just surface the error to user and console.
      console.error('[Dashboard] fetch error:', e?.message || e);
      setError(e?.message || 'خطأ في جلب البيانات');
    } finally {
      setLoading(false);
      (window as any).__isFetchingClinicData = false;
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

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    if (selected.size === 0) return showNotification('لم يتم تحديد أي سجل للحذف');
    if (!confirm('هل أنت متأكد من حذف السجلات المحددة؟ هذا الإجراء لا يمكن التراجع عنه.')) return;
    try {
      const timestamps = patients.filter(p => selected.has(p.id)).map(p => p.rawTimestamp);
      const res = await deleteClinicRecords(timestamps);
      showNotification(`تم الحذف (${res.deletedCount})`);
      setSelected(new Set());
      load();
    } catch (e: any) {
      console.error('Delete failed', e);
      showNotification('فشل الحذف');
    }
  };

  // Count records within the last 24 hours
  const last24Count = patients.filter(p => {
    const t = Date.parse(p.rawTimestamp);
    if (!t) return false;
    return (Date.now() - t) <= 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="w-full bg-white rounded-[2rem] shadow-lg overflow-hidden border border-white animate-fadeIn relative">
      <div className="px-10 py-8 border-b border-white/5 bg-[#1256c4] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User size={26} className="text-[#3498db]" />
          <div>
            <div className="font-black text-xl">تتبع الحالات</div>
            <div className="text-sm text-white/80">عرض البيانات الحية من جدول Google</div>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <div className="text-xs text-white/80">عدد الزيارات (آخر 24 ساعة)</div>
          <div className="text-2xl font-black">{last24Count}</div>
          <button onClick={handleDeleteSelected} className="mt-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">حذف المحدد</button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 text-center text-red-500">خطأ: {error}</div>
        )}

        {!loading && patients.length === 0 && !error && (
          <div className="mb-4 text-center text-slate-400">لا توجد بيانات متاحة</div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
          {patients.map((p, idx) => (
            <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 border-b last:border-b-0">
              <div className="flex items-start gap-4">
                <div className="pt-1">
                  <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} />
                </div>
                <div className="icon-btn">
                  <User size={20} />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-800">{p.fullName}</div>
                  <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                    <Stethoscope size={14} />
                    <span className="font-medium">دكتور/ {p.doctorName}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">{p.registrationTime}</div>
                <div className="text-sm text-slate-500 mt-1">#{idx + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast notification */}
      {notification.visible && (
        <div className="fixed left-6 bottom-6 z-50">
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md rounded-lg px-5 py-3 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div className="text-sm font-medium">{notification.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
