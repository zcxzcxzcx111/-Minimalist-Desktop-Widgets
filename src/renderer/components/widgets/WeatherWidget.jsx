import React, { useState } from 'react';
import { Sun, CloudRain, Wind, Flame, CheckCircle2, Award } from 'lucide-react';

export default function WeatherWidget({ size = '2x1' }) {
  const [habitStreak, setHabitStreak] = useState(5);
  const [dots] = useState([
    true, true, true, true, true, false, false,
    true, true, true, true, false, false, false,
    true, true, true, true, true, true, false,
    false, true, true, true, true, false, false,
  ]);

  if (size === '2x1') {
    // Exact replica of Photo 2 top right (`S M T W T F S` dot matrix + weather info)
    return (
      <div className="w-full h-full flex items-center justify-between select-none p-1 gap-3">
        {/* Left side: Weather & AQI */}
        <div className="flex flex-col justify-between h-full py-1">
          <div className="flex items-center gap-2">
            <Sun size={26} className="text-amber-300 shrink-0" />
            <div>
              <span className="text-[28px] font-black text-white font-mono leading-none block">27°C</span>
              <span className="text-[11px] text-white/80 block mt-0.5">晴空万里 · 优 AQI 32</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold">
            <Flame size={14} />
            <span>专注打卡 · 连续 {habitStreak} 天</span>
          </div>
        </div>

        {/* Right side: S M T W T F S Dot Matrix */}
        <div className="p-2.5 rounded-2xl bg-black/20 border border-white/10 flex flex-col justify-between shrink-0 w-[145px] h-full">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/80">习惯专注</span>
            <span className="text-[10px] font-mono text-cyan-300 font-bold">99h22m</span>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center my-auto">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
              <span key={idx} className="text-[9px] font-mono text-white/50 block">{d}</span>
            ))}
            {dots.slice(0, 14).map((filled, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full mx-auto ${filled ? 'bg-cyan-400 shadow-[0_0_6px_rgba(0,245,212,0.6)]' : 'bg-white/15'}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2x2 shape: Full 7x4 dot calendar matrix + Weather
  return (
    <div className="w-full h-full flex flex-col justify-between select-none p-1">
      <div className="flex items-center justify-between border-b border-white/15 pb-2">
        <div className="flex items-center gap-2">
          <Sun size={18} className="text-amber-300" />
          <span className="text-xs font-extrabold text-white">天气与全勤专注矩阵</span>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-300">99h22m</span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 py-2 my-auto text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
          <span key={idx} className="text-[11px] font-mono font-bold text-cyan-300">{d}</span>
        ))}
        {dots.map((filled, idx) => (
          <div
            key={idx}
            className={`w-3.5 h-3.5 rounded-full mx-auto transition-all ${
              filled ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,245,212,0.8)] scale-105' : 'bg-white/15 hover:bg-white/30'
            }`}
          />
        ))}
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="text-white/80">气温: 27°C (空气质量优)</span>
        <span className="text-cyan-300 font-bold">坚持打卡 {habitStreak} 天 🔥</span>
      </div>
    </div>
  );
}
