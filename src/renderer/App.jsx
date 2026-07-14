import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Maximize2, Pin, Palette, X, Clock, Battery, ListTodo, StickyNote, Quote, Command, Sun, Sparkles, LayoutGrid, Check } from 'lucide-react';
import ClockWidget from './components/widgets/ClockWidget';
import BatteryWidget from './components/widgets/BatteryWidget';
import TodoWidget from './components/widgets/TodoWidget';
import NoteWidget from './components/widgets/NoteWidget';
import QuoteWidget from './components/widgets/QuoteWidget';
import LauncherWidget from './components/widgets/LauncherWidget';
import WeatherWidget from './components/widgets/WeatherWidget';

const availableWidgets = [
  {
    type: 'clock',
    name: '时钟与农历日历',
    icon: Clock,
    desc: '大数字时钟 + 中国农历节气 + 周日历小圆点点亮',
    sizes: ['2x1', '2x2'],
    defaultSize: '2x1'
  },
  {
    type: 'battery',
    name: '设备电量环形表盘',
    icon: Battery,
    desc: 'Apple 经典深色仪表盘，实时监测主机电量与续航状态',
    sizes: ['1x1', '2x2'],
    defaultSize: '2x2'
  },
  {
    type: 'todo',
    name: '每日待办清单 (Todo)',
    icon: ListTodo,
    desc: '在桌面上勾选完成、实时划去消减、回车快速新增任务',
    sizes: ['2x2', '4x2'],
    defaultSize: '2x2'
  },
  {
    type: 'note',
    name: '快捷记事便签薄',
    icon: StickyNote,
    desc: '黄/青/粉/蓝等多色调色盘，打字即时自动持久化保存',
    sizes: ['2x2', '2x3'],
    defaultSize: '2x2'
  },
  {
    type: 'quote',
    name: '每日金句与语音朗读',
    icon: Quote,
    desc: '#每日一句名言警句，中英双语，支持一键朗读语音与切换',
    sizes: ['2x1', '4x1'],
    defaultSize: '2x1'
  },
  {
    type: 'launcher',
    name: '快捷分类与指令池',
    icon: Command,
    desc: '高辨识度彩色书签小标签，直达网址或工作流目录',
    sizes: ['2x2', '4x2'],
    defaultSize: '2x2'
  },
  {
    type: 'weather',
    name: '气温天气与习惯打卡',
    icon: Sun,
    desc: '本地气温与空气质量 + 7日习惯打卡矩阵 (S M T W T F S)',
    sizes: ['2x1', '2x2'],
    defaultSize: '2x1'
  }
];

export default function App() {
  const [params] = useState(() => new URLSearchParams(window.location.search));
  const mode = params.get('mode') || 'hub';
  const widgetId = params.get('id');
  const initialType = params.get('type') || 'clock';
  const initialSize = params.get('size') || '2x1';

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('macwidgets-theme') || 'deepsea';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.on('theme-changed', (event, newTheme) => {
        setTheme(newTheme);
      });
    }
  }, []);

  if (mode === 'hub') {
    return <ControlHub theme={theme} setTheme={setTheme} />;
  } else {
    return <StandaloneWidget id={widgetId} type={initialType} initialSize={initialSize} theme={theme} />;
  }
}

/* ========================================================
   1. Control Hub Window (MacWidgets 控制与组件仓库中心)
   ======================================================== */
function ControlHub({ theme, setTheme }) {
  const [activeWidgets, setActiveWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(availableWidgets[0]);
  const [selectedSize, setSelectedSize] = useState(availableWidgets[0].defaultSize);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('get-widgets-config').then((data) => {
        if (data) setActiveWidgets(data);
      });

      ipcRenderer.on('config-updated', (event, updated) => {
        setActiveWidgets(updated);
      });
    }
  }, []);

  const handleSelectType = (w) => {
    setSelectedWidget(w);
    setSelectedSize(w.defaultSize);
  };

  const handleAddWidget = () => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('add-widget', { type: selectedWidget.type, size: selectedSize });
    }
  };

  const handleRemoveWidget = (id) => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('remove-widget', id);
    }
  };

  const handleToggleTop = (id) => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('toggle-widget-top', { id });
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('macwidgets-theme', newTheme);
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('broadcast-theme', newTheme);
    }
  };

  const themesList = [
    { id: 'deepsea', name: '青蓝深海', color: '#264653' },
    { id: 'graphite', name: '黑晶石墨', color: '#23262C' },
    { id: 'glass', name: '通透白霜', color: '#E5E5E7' }
  ];

  const handleCloseHub = () => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('close-hub');
    }
  };

  return (
    <div className={`w-full h-full p-4 flex flex-col justify-between select-none overflow-hidden theme-${theme} hub-window-bg`}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/15 no-drag-area">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-400 flex items-center justify-center text-gray-950 font-black shadow-lg shadow-cyan-400/40">
            M
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>MacWidgets 控制台</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30">
                独立多窗口架构
              </span>
            </h1>
            <p className="text-[11px] text-white/60">每一个小组件都是桌面上真正独立的透明悬浮窗口，可自由拖到任何角落</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
            <Palette size={14} className="text-white/60 ml-1.5" />
            {themesList.map(t => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`w-5 h-5 rounded-lg border transition-all ${
                  theme === t.id ? 'scale-110 border-cyan-300 shadow-md ring-2 ring-cyan-300/50' : 'border-white/20 opacity-65 hover:opacity-100'
                }`}
                style={{ background: t.color }}
                title={t.name}
              />
            ))}
          </div>

          <button
            onClick={handleCloseHub}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white text-white/80 transition-all flex items-center justify-center"
            title="关闭控制中心 (小组件依然会在桌面运行)"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Body Split: Left Gallery vs Right Active & Config */}
      <div className="flex-1 overflow-hidden grid grid-cols-12 gap-4">
        {/* Left Section: Add New Widget Cards (Cols 1-7) */}
        <div className="col-span-7 flex flex-col justify-between overflow-hidden pr-2 border-r border-white/10">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                <Sparkles size={14} /> 组件类型库 · 点击挑选
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[310px] overflow-y-auto pr-1">
              {availableWidgets.map(w => {
                const Icon = w.icon;
                const isSelected = selectedWidget.type === w.type;
                return (
                  <div
                    key={w.type}
                    onClick={() => handleSelectType(w)}
                    className={`p-3 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-[1.02]'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-cyan-400 text-gray-950 font-bold' : 'bg-white/10 text-white'}`}>
                        <Icon size={18} />
                      </div>
                      <h3 className="text-xs font-bold truncate">{w.name}</h3>
                    </div>
                    <p className="text-[11px] text-white/60 leading-normal line-clamp-2">{w.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Widget Size Selector & Add Button */}
          <div className="p-3 rounded-2xl bg-black/30 border border-white/10 mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">选择尺寸 ({selectedWidget.name})</span>
              <div className="flex gap-1.5">
                {selectedWidget.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold border transition-all ${
                      selectedSize === size
                        ? 'bg-cyan-400 text-gray-950 border-cyan-400 shadow-sm'
                        : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddWidget}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-gray-950 font-black text-xs shadow-lg shadow-cyan-400/30 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus size={16} strokeWidth={3} />
              <span>一键添置独立窗口到桌面</span>
            </button>
          </div>
        </div>

        {/* Right Section: Active Widgets Manager (Cols 8-12) */}
        <div className="col-span-5 flex flex-col justify-between overflow-hidden pl-1">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1">
              <LayoutGrid size={14} className="text-cyan-300" /> 当前已放桌面 ({activeWidgets.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {activeWidgets.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-white/40 text-xs gap-2">
                <span>当前桌面无卡片，快左侧一键添加吧！</span>
              </div>
            ) : (
              activeWidgets.map((w, idx) => {
                const wInfo = availableWidgets.find(a => a.type === w.type) || { name: w.type };
                return (
                  <div
                    key={w.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="overflow-hidden pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{wInfo.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                          {w.size}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/40 block mt-0.5">
                        坐标: X:{Math.round(w.x)} Y:{Math.round(w.y)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleTop(w.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          w.alwaysOnTop ? 'bg-amber-400 text-gray-950 border-amber-400 font-bold' : 'bg-white/10 text-white/50 border-white/10 hover:text-white'
                        }`}
                        title={w.alwaysOnTop ? '当前处于置顶层' : '点击将该卡片置顶在所有应用最上面'}
                      >
                        <Pin size={13} />
                      </button>
                      <button
                        onClick={() => handleRemoveWidget(w.id)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500 hover:text-white text-white/60 transition-all"
                        title="从桌面移除该卡片"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 mt-2 border-t border-white/10 text-[10px] text-white/50 text-center">
            💡 提示: 双击任务栏/系统托盘图标即可随时呼出本控制后台
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================
   2. Standalone Individual Widget Window (真正独立的桌面小窗口)
   ======================================================== */
function StandaloneWidget({ id, type, initialSize, theme }) {
  const [size, setSize] = useState(initialSize);
  const [isTop, setIsTop] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.on('size-changed', (event, newSize) => {
        setSize(newSize);
      });
      ipcRenderer.on('top-changed', (event, topFlag) => {
        setIsTop(topFlag);
      });
    }
  }, []);

  const handleToggleSize = () => {
    let nextSize = '2x2';
    if (size === '2x1') nextSize = '2x2';
    else if (size === '2x2') nextSize = '4x2';
    else if (size === '4x2') nextSize = '1x1';
    else if (size === '1x1') nextSize = '2x1';
    else nextSize = '2x2';

    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('update-widget-size', { id, nextSize });
    } else {
      setSize(nextSize);
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('remove-widget', id);
    }
  };

  const handleToggleTop = () => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('toggle-widget-top', { id });
    }
  };

  const renderInnerWidget = () => {
    switch (type) {
      case 'clock': return <ClockWidget size={size} />;
      case 'battery': return <BatteryWidget size={size} />;
      case 'todo': return <TodoWidget size={size} />;
      case 'note': return <NoteWidget id={id || 'default'} size={size} />;
      case 'quote': return <QuoteWidget size={size} />;
      case 'launcher': return <LauncherWidget size={size} />;
      case 'weather': return <WeatherWidget size={size} />;
      default: return <div>Widget {type}</div>;
    }
  };

  return (
    <div className={`w-screen h-screen p-1.5 overflow-hidden select-none theme-${theme}`}>
      <div className="w-full h-full rounded-[24px] widget-island-card relative flex flex-col justify-between overflow-hidden drag-area">
        {/* Top-right floating controls (visible on card hover, non-draggable) */}
        <div className="widget-floating-actions no-drag-area">
          <button
            onClick={handleToggleTop}
            className={`tool-pill-btn ${isTop ? 'bg-amber-400 text-gray-950 font-bold' : ''}`}
            title={isTop ? '当前已置顶在所有窗口最前面 (点击取消)' : '点击置顶该卡片'}
          >
            <Pin size={11} />
          </button>
          <button
            onClick={handleToggleSize}
            className="tool-pill-btn"
            title="切换规格大小 (2x1 <-> 2x2)"
          >
            <Maximize2 size={11} />
          </button>
          <button
            onClick={handleClose}
            className="tool-pill-btn hover:bg-red-500 hover:text-white"
            title="关闭此组件"
          >
            <X size={11} />
          </button>
        </div>

        {/* Widget Content Body */}
        <div className="w-full h-full no-drag-area">
          {renderInnerWidget()}
        </div>
      </div>
    </div>
  );
}
