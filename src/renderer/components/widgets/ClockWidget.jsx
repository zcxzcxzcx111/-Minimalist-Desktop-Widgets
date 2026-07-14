import React, { useState, useEffect } from 'react';
import { getLunarDate } from '../../../utils/lunar';
import { Clock, Calendar } from 'lucide-react';

export default function ClockWidget({ size = '2x1' }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const month = now.getMonth() + 1;
  const date = now.getDate();
  const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dayName = daysOfWeek[now.getDay()];
  
  const lunar = getLunarDate(now);
  const lunarStr = `${lunar.monthStr}${lunar.dayStr}`;

  if (size === '2x1') {
    // Exact 1:1 replica of Photo 1 top-left red circle (`16 54 13` / `7月3日 周四 六月初九`)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center select-none pt-1">
        {/* Apple Display Digits with nice spacing exactly like Photo 1 */}
        <div className="clock-display-digits text-[46px] tracking-[6px] text-white flex items-center font-mono">
          <span>{hours}</span>
          <span className="mx-1 text-cyan-300/80 font-light">:</span>
          <span>{minutes}</span>
          <span className="mx-1 text-cyan-300/80 font-light">:</span>
          <span className="text-cyan-300">{seconds}</span>
        </div>

        {/* Date & Lunar Date Subtitle Pill */}
        <div className="mt-3.5 flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 shadow-sm">
          <span className="text-[13px] font-extrabold text-white tracking-wide">
            {month}月{date}日 {dayName}
          </span>
          <span className="text-[12px] font-bold text-cyan-300 border-l border-white/20 pl-2">
            {lunarStr}
          </span>
          {lunar.term && (
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-cyan-400 text-gray-950 font-black">
              {lunar.term}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 2x2 shape: Big digits + Weekday dot calendar matrix
  return (
    <div className="w-full h-full flex flex-col justify-between select-none p-1">
      <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-cyan-300" />
          <span className="text-xs font-bold text-white/80">标准时间与农历</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
          {lunar.yearStr} ({lunar.zodiac})
        </span>
      </div>

      <div className="my-auto text-center py-2">
        <div className="clock-display-digits text-[50px] tracking-[5px] text-white flex items-center justify-center">
          <span>{hours}</span>
          <span className="mx-1.5 text-cyan-300">:</span>
          <span>{minutes}</span>
        </div>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-sm font-extrabold text-white">{month}月{date}日 {dayName}</span>
          <span className="text-xs font-bold text-cyan-300 px-2 py-0.5 rounded bg-white/10">{lunarStr}</span>
        </div>
      </div>

      {/* Week dots bar */}
      <div className="grid grid-cols-7 gap-1 pt-2 border-t border-white/10 text-center">
        {['日', '一', '二', '三', '四', '五', '六'].map((d, i) => {
          const isToday = now.getDay() === i;
          return (
            <div key={d} className={`py-1 rounded-lg flex flex-col items-center ${isToday ? 'bg-cyan-400 text-gray-950 font-black' : 'text-white/60'}`}>
              <span className="text-[10px] block">{d}</span>
              <span className="text-[11px] mt-0.5 block">{isToday ? date : '·'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
