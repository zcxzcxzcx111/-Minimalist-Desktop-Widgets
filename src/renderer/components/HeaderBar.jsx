import React from 'react';
import { Plus, LayoutGrid, Move, Lock, Palette, Minus, X, Pin, Sparkles } from 'lucide-react';

export default function HeaderBar({
  mode,
  setMode,
  isDragLocked,
  setIsDragLocked,
  theme,
  setTheme,
  onOpenAddModal,
  isAlwaysOnTop,
  toggleTop
}) {
  const handleMinimize = () => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('window-minimize');
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('window-close');
    }
  };

  const themes = [
    { id: 'deepsea', name: '青蓝深海', color: '#264653' },
    { id: 'graphite', name: '黑晶石墨', color: '#23262C' },
    { id: 'glass', name: '通透白霜', color: '#E5E5E7' },
  ];

  return (
    <header className="control-bar text-xs select-none">
      {/* Left Title & Mode Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-bold text-white text-sm tracking-wide">
          <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/50 animate-pulse"></span>
          <span>MacWidgets</span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-semibold text-cyan-300 border border-white/10">
            Sonoma
          </span>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 gap-1">
          <button
            onClick={() => setMode('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all font-semibold ${
              mode === 'dashboard'
                ? 'bg-cyan-400 text-gray-950 shadow-md shadow-cyan-400/30'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <LayoutGrid size={14} />
            <span>看板网格模式</span>
          </button>
          <button
            onClick={() => setMode('floating')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all font-semibold ${
              mode === 'floating'
                ? 'bg-cyan-400 text-gray-950 shadow-md shadow-cyan-400/30'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Move size={14} />
            <span>自由悬浮散贴</span>
          </button>
        </div>

        {/* Drag Lock button only visible/enabled in Floating Mode */}
        {mode === 'floating' && (
          <button
            onClick={() => setIsDragLocked(!isDragLocked)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all font-semibold ${
              isDragLocked
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30 animate-pulse'
            }`}
            title={isDragLocked ? '当前已锁定坐标，点击可解开拖动' : '当前可按住卡片边角自由拖动到桌面任意位置'}
          >
            {isDragLocked ? <Lock size={14} /> : <Move size={14} />}
            <span>{isDragLocked ? '已锁定位置' : '按住可自由拖拽'}</span>
          </button>
        )}
      </div>

      {/* Right Controls: Add Widget, Themes, Pin, Window Controls */}
      <div className="flex items-center gap-3">
        {/* Add Widget Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-gray-950 font-extrabold shadow-lg shadow-cyan-400/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={16} strokeWidth={3} />
          <span>添加组件</span>
        </button>

        {/* Theme Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10">
          <Palette size={14} className="text-white/50 ml-1.5 mr-0.5" />
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-5 h-5 rounded-lg transition-all border flex items-center justify-center ${
                theme === t.id
                  ? 'scale-110 border-cyan-300 shadow-sm'
                  : 'border-white/20 opacity-60 hover:opacity-100'
              }`}
              style={{ background: t.color }}
              title={`切换主题: ${t.name}`}
            />
          ))}
        </div>

        {/* Topmost / Pin toggle */}
        <button
          onClick={toggleTop}
          className={`p-1.5 rounded-xl border transition-all ${
            isAlwaysOnTop
              ? 'bg-purple-500/30 text-purple-300 border-purple-400/50'
              : 'bg-white/10 text-white/60 border-white/10 hover:bg-white/20'
          }`}
          title={isAlwaysOnTop ? '当前已置顶于最前面' : '点击将组件置顶在全部窗口上方'}
        >
          <Pin size={15} />
        </button>

        {/* Window controls */}
        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/15">
          <button
            onClick={handleMinimize}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center transition-all"
            title="最小化到任务栏"
          >
            <Minus size={15} />
          </button>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center transition-all"
            title="关闭应用"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
