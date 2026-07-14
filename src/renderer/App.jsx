import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Maximize2, Pin, Palette, X, Clock, Battery, ListTodo, StickyNote, Quote, Command, Sun, Sparkles, LayoutGrid, Check, Lock, Unlock, Settings, Layers, Eye } from 'lucide-react';
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
    desc: '1:1复刻大号连续数字时钟 + 农历与周历点亮',
    sizes: ['2x1', '2x2'],
    defaultSize: '2x1'
  },
  {
    type: 'battery',
    name: '电量与设备圆环盘',
    icon: Battery,
    desc: '1:1复刻图二红圈：4设备圆框网格 + 右侧大圆环进度表',
    sizes: ['1x1', '2x1'],
    defaultSize: '2x1'
  },
  {
    type: 'todo',
    name: '每日待办清单 (Todo)',
    icon: ListTodo,
    desc: '1:1复刻图一待办：顶栏数字统计 + 原生圆形单选框与划线',
    sizes: ['2x2', '4x2'],
    defaultSize: '2x2'
  },
  {
    type: 'launcher',
    name: '快捷书签与指令方阵',
    icon: Command,
    desc: '1:1复刻图二第二组：8组分类圆角方框，点击直达',
    sizes: ['2x2', '4x2'],
    defaultSize: '2x2'
  },
  {
    type: 'weather',
    name: '全勤专注与天气矩阵',
    icon: Sun,
    desc: '1:1复刻图二右上：S M T W T F S 习惯专注打卡矩阵 + 气温',
    sizes: ['2x1', '2x2'],
    defaultSize: '2x1'
  },
  {
    type: 'note',
    name: '桌面灵感便签薄',
    icon: StickyNote,
    desc: '黄/青/粉/蓝经典调色盘，点击即可直接打字记事并保存',
    sizes: ['2x2', '2x3'],
    defaultSize: '2x2'
  },
  {
    type: 'quote',
    name: '每日金句与语音朗读',
    icon: Quote,
    desc: '1:1复刻图一 #每日一句 灵感名言，支持 TTS 语音朗读发声',
    sizes: ['2x1', '4x1'],
    defaultSize: '2x1'
  }
];

export default function App() {
  const [params] = useState(() => new URLSearchParams(window.location.search));
  const mode = params.get('mode') || 'hub';
  const widgetId = params.get('id');
  const initialType = params.get('type') || 'clock';
  const initialSize = params.get('size') || '2x1';
  const initialLocked = params.get('locked') === 'true';

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
    return <StandaloneWidget id={widgetId} type={initialType} initialSize={initialSize} initialLocked={initialLocked} theme={theme} />;
  }
}

/* ========================================================
   1. Control Hub / Settings Window (纯正不透明实体窗设置中心)
   ======================================================== */
function ControlHub({ theme, setTheme }) {
  const [activeTab, setActiveTab] = useState('gallery');
  const [activeWidgets, setActiveWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(availableWidgets[0]);
  const [selectedSize, setSelectedSize] = useState(availableWidgets[0].defaultSize);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('get-widgets-config').then((data) => {
        if (data) setActiveWidgets(data);
      });
      ipcRenderer.invoke('get-lock-status').then((locked) => {
        setIsLocked(locked);
      });

      ipcRenderer.on('config-updated', (event, updated) => {
        setActiveWidgets(updated);
      });
      ipcRenderer.on('lock-changed', (event, locked) => {
        setIsLocked(locked);
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

  const handleFocusWidget = (id) => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('focus-widget', id);
    }
  };

  const handleToggleTop = (id) => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('toggle-widget-top', { id });
    }
  };

  const handleToggleGlobalLock = () => {
    const targetState = !isLocked;
    setIsLocked(targetState);
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('toggle-global-lock', targetState);
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
    { id: 'deepsea', name: '青蓝深海提尔绿 (1:1 原图同款色)', color: '#23444E' },
    { id: 'graphite', name: '黑晶暗夜 (Graphite Dark)', color: '#23262C' },
    { id: 'glass', name: '通透晨霜 (Frosted Light)', color: '#E5E5E7' }
  ];

  return (
    <div className="w-full h-full bg-[#1C1C1E] text-white flex flex-col justify-between select-none font-sans overflow-hidden border-t border-white/10">
      {/* Top Navigation */}
      <div className="px-6 py-4 bg-[#252529] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-gray-950 font-black text-lg shadow-md shadow-cyan-500/20">
            
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>MacWidgets 桌面小组件设置中心</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                1:1 苹果外形形状曲率复刻
              </span>
            </h1>
            <p className="text-xs text-white/60">正规实体窗口设置（不透明抗干扰） · 单个独立模块圆角 Squircle 28px</p>
          </div>
        </div>

        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'gallery' ? 'bg-cyan-400 text-gray-950 shadow-sm' : 'text-white/70 hover:text-white'
            }`}
          >
            <Sparkles size={14} /> 1:1 外形组件库 (挑选放置)
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'manage' ? 'bg-cyan-400 text-gray-950 shadow-sm' : 'text-white/70 hover:text-white'
            }`}
          >
            <Layers size={14} /> 桌面固定与锁固 ({activeWidgets.length})
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-hidden p-6">
        {activeTab === 'gallery' ? (
          <div className="h-full flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 gap-4">
              {availableWidgets.map(w => {
                const Icon = w.icon;
                const isSelected = selectedWidget.type === w.type;
                return (
                  <div
                    key={w.type}
                    onClick={() => handleSelectType(w)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                        : 'bg-[#2C2C30] border-white/10 hover:bg-[#343438]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-cyan-400 text-gray-950 font-extrabold shadow-md' : 'bg-white/10 text-white'}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-white">{w.name}</h3>
                          <span className="text-[11px] text-cyan-300/80 font-mono">1:1 Squircle 规格: {w.sizes.join(', ')}</span>
                        </div>
                      </div>
                      {isSelected && <Check size={18} className="text-cyan-400" />}
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">{w.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between bg-[#252529] p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">已挑：<span className="text-cyan-300">{selectedWidget.name}</span></span>
                <span className="text-xs text-white/50">选择组件外形比例：</span>
                <div className="flex gap-2">
                  {selectedWidget.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-black border transition-all ${
                        selectedSize === size
                          ? 'bg-cyan-400 text-gray-950 border-cyan-400 shadow-md'
                          : 'bg-black/30 text-white/80 border-white/15 hover:bg-black/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddWidget}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-gray-950 font-black text-sm shadow-lg shadow-cyan-400/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-2"
              >
                <Plus size={18} strokeWidth={3} />
                <span>立即放置此模块到桌面</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-between overflow-hidden">
            <div className="space-y-6 overflow-y-auto pr-2">
              <div className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
                isLocked ? 'bg-cyan-500/15 border-cyan-400/60 shadow-lg shadow-cyan-500/10' : 'bg-[#2C2C30] border-white/10'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLocked ? 'bg-cyan-400 text-gray-950' : 'bg-white/10 text-white'}`}>
                    {isLocked ? <Lock size={24} /> : <Unlock size={24} />}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <span>{isLocked ? '🔒 桌面所有模块已锁固在底层 (防误触保护中)' : '🔓 桌面模块为未锁固状态 (可鼠标自由拖放排布)'}</span>
                      {isLocked && <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-400 text-gray-950 font-black">苹果原生逻辑</span>}
                    </h3>
                    <p className="text-xs text-white/70 mt-1 leading-normal">
                      {isLocked
                        ? '所有放置在桌面的组件卡片已经锁定在桌面底层，点击打字或勾选 Todo 时绝对不会误触偏移！'
                        : '当前状态下你可以通过鼠标按住任何组件卡片拖放到桌面上最合适的位置。调整满意后建议开启锁定！'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleGlobalLock}
                  className={`px-5 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-md ${
                    isLocked
                      ? 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                      : 'bg-cyan-400 text-gray-950 hover:bg-cyan-300'
                  }`}
                >
                  {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                  <span>{isLocked ? '点击解锁 (调节布局)' : '点击锁定所有小组件'}</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#2C2C30] border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Palette size={16} className="text-cyan-300" />
                    <span>卡片玻璃外观与色系设置 (默认匹配图二提尔青)</span>
                  </h3>
                  <p className="text-xs text-white/60 mt-1">切换桌面所有模块的高透抗干扰色板</p>
                </div>
                <div className="flex gap-3">
                  {themesList.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                        theme === t.id ? 'border-cyan-400 bg-black/40 text-cyan-300 shadow-md ring-2 ring-cyan-400/30' : 'border-white/15 bg-black/20 text-white/70 hover:opacity-100'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ background: t.color }} />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
                  <LayoutGrid size={16} className="text-cyan-300" />
                  <span>当前桌面已放置的独立小组件 ({activeWidgets.length})</span>
                </h3>
                <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                  {activeWidgets.map(w => {
                    const wInfo = availableWidgets.find(a => a.type === w.type) || { name: w.type };
                    return (
                      <div
                        key={w.id}
                        className="p-3 rounded-xl bg-[#252529] border border-white/10 flex items-center justify-between hover:bg-[#2F2F34] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-white">{wInfo.name}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                            {w.size}
                          </span>
                          <span className="text-[11px] text-white/50 font-mono">
                            (坐标 X: {Math.round(w.x)}, Y: {Math.round(w.y)})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFocusWidget(w.id)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white/90 transition-all flex items-center gap-1 font-bold"
                            title="把该卡片带到最前面显示"
                          >
                            <Eye size={13} /> 定位聚焦
                          </button>
                          <button
                            onClick={() => handleToggleTop(w.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${
                              w.alwaysOnTop ? 'bg-amber-400 text-gray-950 border-amber-400' : 'bg-white/10 text-white/70 border-white/10 hover:text-white'
                            }`}
                          >
                            <Pin size={13} /> {w.alwaysOnTop ? '已置顶' : '置顶'}
                          </button>
                          <button
                            onClick={() => handleRemoveWidget(w.id)}
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white transition-all ml-2"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-white/10 text-xs text-white/50 flex items-center justify-between">
              <span>💡 小提示: 双击桌面右下角任务栏托盘图标，随时呼出此设置页面</span>
              <span className="text-cyan-300/80 font-mono">MacWidgets v2.2 · 1:1 Apple Squircle Contour</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================
   2. Standalone Individual Widget Window (真正独立单模块卡片)
   ======================================================== */
function StandaloneWidget({ id, type, initialSize, initialLocked, theme }) {
  const [size, setSize] = useState(initialSize);
  const [isTop, setIsTop] = useState(false);
  const [isLocked, setIsLocked] = useState(initialLocked);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.on('size-changed', (event, newSize) => {
        setSize(newSize);
      });
      ipcRenderer.on('top-changed', (event, topFlag) => {
        setIsTop(topFlag);
      });
      ipcRenderer.on('lock-changed', (event, lockedFlag) => {
        setIsLocked(lockedFlag);
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
      <div className={`w-full h-full rounded-[28px] widget-island-card relative flex flex-col justify-between overflow-hidden ${isLocked ? 'no-drag-area cursor-default' : 'drag-area cursor-move'}`}>
        {/* Top-right floating controls (only visible on hover when NOT locked) */}
        {!isLocked && (
          <div className="widget-floating-actions no-drag-area">
            <button
              onClick={handleToggleTop}
              className={`tool-pill-btn ${isTop ? 'bg-amber-400 text-gray-950 font-bold' : ''}`}
              title={isTop ? '当前已开启置顶' : '点击置顶该组件'}
            >
              <Pin size={11} />
            </button>
            <button
              onClick={handleToggleSize}
              className="tool-pill-btn"
              title="切换外形规格"
            >
              <Maximize2 size={11} />
            </button>
            <button
              onClick={handleClose}
              className="tool-pill-btn hover:bg-red-500 hover:text-white"
              title="关闭此卡片"
            >
              <X size={11} />
            </button>
          </div>
        )}

        {/* Locked badge indicator when hovered */}
        {isLocked && (
          <div className="widget-locked-badge no-drag-area">
            <Lock size={10} className="text-cyan-300" />
          </div>
        )}

        {/* Inner Content */}
        <div className="w-full h-full no-drag-area">
          {renderInnerWidget()}
        </div>
      </div>
    </div>
  );
}
