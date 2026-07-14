import React, { useState, useEffect } from 'react';
import { Battery, BatteryCharging, Laptop, Smartphone, Headphones, Watch, ShieldAlert } from 'lucide-react';

export default function BatteryWidget({ size = '2x1' }) {
  const [batteryLevel, setBatteryLevel] = useState(89);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        const update = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        update();
        battery.addEventListener('levelchange', update);
        battery.addEventListener('chargingchange', update);
      });
    }
  }, []);

  if (size === '1x1') {
    // 1:1 replica of Photo 1 middle-left `1x1` squircle (`电脑图 + 53%` big number)
    return (
      <div className="w-full h-full flex flex-col justify-between select-none p-1">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-300 shadow-inner">
            <Laptop size={18} />
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30">
            {isCharging ? '正在充电' : '主机正常'}
          </span>
        </div>

        <div className="my-auto flex items-center justify-between pt-2">
          <div>
            <div className="text-[36px] font-black tracking-tight text-white font-mono leading-none">
              {batteryLevel}%
            </div>
            <span className="text-[11px] text-white/60 block mt-1">续航良好 · PC Main</span>
          </div>

          {/* Mini Ring Chart */}
          <div className="w-13 h-13 rounded-full border-4 border-white/15 flex items-center justify-center relative">
            <svg className="w-13 h-13 absolute -rotate-90">
              <circle
                cx="26"
                cy="26"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                className="text-cyan-400"
                fill="none"
                strokeDasharray="125"
                strokeDashoffset={125 - (125 * batteryLevel) / 100}
                strokeLinecap="round"
              />
            </svg>
            <Battery size={16} className="text-cyan-300" />
          </div>
        </div>
      </div>
    );
  }

  // 2x1 shape: EXACT 1:1 replica of Photo 2 top-left red circle (Apple System Battery `2x1` wide squircle)
  // Left half: 4 circular/squircle device badges (`PC Main`, `iPhone`, `AirPods`, `Watch`)
  // Right half: Giant circle ring gauge (`7小时1分` inside the ring)
  return (
    <div className="w-full h-full flex items-center justify-between select-none p-1 gap-4">
      {/* Left side: 4 device status grid */}
      <div className="grid grid-cols-2 gap-2.5 flex-1 h-full">
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-300 shrink-0">
            <Laptop size={15} />
          </div>
          <div className="overflow-hidden">
            <span className="text-[11px] font-bold text-white block truncate">PC Main</span>
            <span className="text-[11px] font-mono text-cyan-300 font-bold">{batteryLevel}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 shrink-0">
            <Smartphone size={15} />
          </div>
          <div className="overflow-hidden">
            <span className="text-[11px] font-bold text-white block truncate">iPhone</span>
            <span className="text-[11px] font-mono text-white/70">92%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 shrink-0">
            <Headphones size={15} />
          </div>
          <div className="overflow-hidden">
            <span className="text-[11px] font-bold text-white block truncate">AirPods Pro</span>
            <span className="text-[11px] font-mono text-white/70">100%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 shrink-0">
            <Watch size={15} />
          </div>
          <div className="overflow-hidden">
            <span className="text-[11px] font-bold text-white block truncate">Watch</span>
            <span className="text-[11px] font-mono text-white/70">68%</span>
          </div>
        </div>
      </div>

      {/* Right side: Big Apple Ring Gauge */}
      <div className="w-[130px] h-[130px] rounded-full border-[10px] border-white/10 flex flex-col items-center justify-center relative shrink-0 shadow-inner">
        <svg className="w-full h-full absolute top-0 left-0 -rotate-90">
          <circle
            cx="65"
            cy="65"
            r="55"
            stroke="currentColor"
            strokeWidth="10"
            className="text-cyan-400"
            fill="none"
            strokeDasharray="345"
            strokeDashoffset={345 - (345 * batteryLevel) / 100}
            strokeLinecap="round"
          />
        </svg>
        <span className="text-xs font-bold text-white/80 z-10">预计可用</span>
        <span className="text-base font-black text-cyan-300 font-mono z-10 mt-0.5">7小时12分</span>
      </div>
    </div>
  );
}
