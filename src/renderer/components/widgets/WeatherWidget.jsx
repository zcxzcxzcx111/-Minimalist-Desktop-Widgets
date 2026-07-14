import React, { useState } from 'react';
import { Sun, CloudRain, Wind, Award, Flame, CheckCircle2 } from 'lucide-react';

export default function WeatherWidget({ size = '2x1' }) {
  const [habitDays, setHabitDays] = useState([true, true, true, false, true, true, false]);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const toggleDay = (index) => {
    const next = [...habitDays];
    next[index] = !next[index];
    setHabitDays(next);
  };

  const completedCount = habitDays.filter(Boolean).length;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {size === '2x1' ? (
        <div className="flex items-center justify-between h-full">
          {/* Left Weather */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <Sun size={28} className="text-amber-300 animate-spin-slow" />
              <span className="text-3xl font-black text-white tracking-tight">27°C</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-white/80 mt-1">
              <span className="text-cyan-300 font-bold">晴空万里</span>
              <span>· 空气优 (AQI 32)</span>
            </div>
          </div>

          {/* Right Habit Tracker */}
          <div className="flex flex-col items-end justify-center border-l border-white/10 pl-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1.5">
              <Flame size={14} className="text-amber-400" />
              <span>习惯打卡 · 已坚持 {completedCount} 天</span>
            </div>
            <div className="flex items-center gap-1.5">
              {days.map((d, i) => (
                <div
                  key={i}
                  onClick={() => toggleDay(i)}
                  className={`w-6 h-6 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer transition-all ${
                    habitDays[i]
                      ? 'bg-cyan-400 text-gray-950 shadow-md shadow-cyan-400/30 scale-105'
                      : 'bg-white/10 text-white/50 hover:bg-white/20'
                  }`}
                  title={`点击切换 ${d} 日打卡状态`}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 2x2 Weather & Habit Card */
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white/50">本地天气与习惯</span>
              <div className="flex items-center gap-3 mt-1">
                <Sun size={38} className="text-amber-300" />
                <div>
                  <span className="text-4xl font-black text-white">27°C</span>
                  <p className="text-xs font-bold text-cyan-300">晴天 · 适合高效学习与创造</p>
                </div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-white">
              湿度 54%
            </span>
          </div>

          {/* Habit Tracker Section */}
          <div className="my-2 p-3 rounded-2xl bg-black/20 border border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5 text-white">
                <Award size={16} className="text-amber-400" />
                <span>本周专注时间追踪</span>
              </div>
              <span className="text-cyan-300 font-extrabold">累计 15小时33分</span>
            </div>

            <div className="grid grid-cols-7 gap-1 pt-1 text-center">
              {days.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-white/50">{d}</span>
                  <button
                    onClick={() => toggleDay(i)}
                    className={`w-7 h-7 rounded-full font-bold text-xs transition-all flex items-center justify-center ${
                      habitDays[i]
                        ? 'bg-cyan-400 text-gray-950 shadow-md shadow-cyan-400/40'
                        : 'bg-white/10 text-white/40 hover:bg-white/20'
                    }`}
                  >
                    {habitDays[i] ? '✓' : '·'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/60 font-medium">
            <span>下周预报: 晴转多云 24~29°C</span>
            <span className="text-cyan-300">每日 23:00 重置提示</span>
          </div>
        </div>
      )}
    </div>
  );
}
