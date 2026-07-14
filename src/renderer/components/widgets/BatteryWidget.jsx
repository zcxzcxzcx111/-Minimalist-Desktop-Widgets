import React, { useState, useEffect } from 'react';
import { Battery, BatteryCharging, Laptop, Headphones, Watch, ShieldAlert } from 'lucide-react';

export default function BatteryWidget({ size = '2x2' }) {
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [isCharging, setIsCharging] = useState(false);
  const [chargingTime, setChargingTime] = useState(null);

  useEffect(() => {
    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      }).catch(() => {
        // Fallback or simulated state
      });
    }
  }, []);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (batteryLevel / 100) * circumference;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCharging ? (
            <BatteryCharging size={18} className="text-cyan-300 animate-pulse" />
          ) : (
            <Battery size={18} className="text-white/70" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-white/70">
            {isCharging ? '正在充电中' : '设备电量状态'}
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 font-semibold border border-white/10">
          PC Main
        </span>
      </div>

      {size === '1x1' ? (
        <div className="flex flex-col items-center justify-center flex-1 my-1">
          <div className="relative flex items-center justify-center">
            <svg className="w-20 h-20 -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.12)" strokeWidth="6" fill="transparent" />
              <circle
                cx="40" cy="40" r="32"
                stroke="#00F5D4" strokeWidth="6" strokeDasharray={2 * Math.PI * 32}
                strokeDashoffset={(2 * Math.PI * 32) - (batteryLevel / 100) * (2 * Math.PI * 32)}
                strokeLinecap="round" fill="transparent"
                className="transition-all duration-700 ease-out live-pulse"
              />
            </svg>
            <span className="absolute text-lg font-bold text-white">{batteryLevel}%</span>
          </div>
        </div>
      ) : (
        /* 2x2 or 2x1 layout */
        <div className="flex items-center justify-around flex-1 my-2">
          {/* Main Circular Ring */}
          <div className="relative flex items-center justify-center">
            <svg className="w-28 h-28 -rotate-90">
              <circle cx="56" cy="56" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="8" fill="transparent" />
              <circle
                cx="56" cy="56" r={radius}
                stroke="#00F5D4"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out live-pulse"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <Laptop size={20} className="text-white/60 mb-1" />
              <span className="text-2xl font-black text-white tracking-tight">{batteryLevel}%</span>
            </div>
          </div>

          {/* Sub devices info / Stats column */}
          <div className="flex flex-col gap-2.5 flex-1 ml-4">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones size={16} className="text-cyan-300" />
                <span className="text-xs font-medium text-white/90">AirPods Pro</span>
              </div>
              <span className="text-xs font-bold text-cyan-300">92%</span>
            </div>

            <div className="p-2 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Watch size={16} className="text-purple-300" />
                <span className="text-xs font-medium text-white/90">智能手表</span>
              </div>
              <span className="text-xs font-bold text-purple-300">65%</span>
            </div>

            <div className="text-[11px] text-white/60 pl-1 font-medium flex items-center justify-between">
              <span>预计续航时间</span>
              <span className="text-white font-bold">约 7小时 12分</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer bar */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
        <span>电源模式: {isCharging ? '接通电源充电中' : '最佳性能/均衡'}</span>
        <span className="flex items-center gap-1 text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          实时监测
        </span>
      </div>
    </div>
  );
}
