import React, { useState, useEffect } from 'react';
import { getLunarDate } from '../../../utils/lunar';
import { Clock, Calendar } from 'lucide-react';

export default function ClockWidget({ size = '2x1' }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const month = now.getMonth() + 1;
  const date = now.getDate();
  const lunar = getLunarDate(now);

  // Generate mini week grid for 2x2 card
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const currentDayOfWeek = now.getDay();

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {size === '2x1' ? (
        <div className="flex flex-col justify-center h-full">
          <div className="flex items-baseline justify-between mb-2">
            <span className="clock-time text-4xl tracking-widest font-extrabold text-white flex gap-2">
              <span>{hours}</span>
              <span className="opacity-60 font-light">:</span>
              <span>{minutes}</span>
              <span className="opacity-60 font-light">:</span>
              <span className="text-cyan-300">{seconds}</span>
            </span>
            <Clock size={18} className="text-white/40" />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-white/85">
            <span>{month}月{date}日 {lunar.weekday}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/15 text-xs text-cyan-200 border border-white/10">
              {lunar.full}
            </span>
          </div>
        </div>
      ) : (
        /* 2x2 Square Clock Card */
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">Current Time</span>
              <div className="clock-time text-5xl tracking-wide font-extrabold text-white flex items-center gap-2">
                <span>{hours}</span>
                <span className="opacity-40 text-3xl font-light">:</span>
                <span>{minutes}</span>
              </div>
              <span className="text-xl font-bold text-cyan-300 mt-0.5">{seconds}s</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <Calendar size={20} className="text-cyan-300" />
            </div>
          </div>

          <div className="my-2 p-2.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">{month}月{date}日 {lunar.weekday}</span>
            <span className="text-xs font-medium text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded-lg border border-cyan-400/30">
              农历 {lunar.full}
            </span>
          </div>

          {/* Mini Week Matrix */}
          <div className="grid grid-cols-7 gap-1 pt-1 border-t border-white/10 text-center">
            {weekDays.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1">
                <span className="text-[11px] text-white/50 font-medium">{d}</span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i === currentDayOfWeek
                      ? 'bg-cyan-400 text-gray-950 shadow-lg shadow-cyan-400/40 scale-110'
                      : 'bg-white/5 text-white/75'
                  }`}
                >
                  {i === currentDayOfWeek ? date : (date - currentDayOfWeek + i)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
