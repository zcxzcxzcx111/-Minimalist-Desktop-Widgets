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
    desc: '大号精准时钟 + 中国农历节气（如：六月初九）+ 周历点亮',
    sizes: ['2x1', '2x2'],
    defaultSize: '2x1'
  },
  {
    type: 'battery',
    name: '电量与续航仪表盘',
    icon: Battery,
    desc: 'Apple 经典环形电量进度表，实时监测主机电量与周边设备状态',
    sizes: ['1x1', '2x2'],
    defaultSize: '2x2'
  },
  {
    type: 'todo',
    name: '每日待办清单 (Todo)',
    icon: ListTodo,
    desc: '在桌面上点击勾选划去消减、回车快速新增任务、支持持久保存',
    sizes: ['2x2', '4x2'],
    defaultSize: '2x2'
  },
  {
    type: 'note',
    name: '桌面便签薄',
    icon: StickyNote,
    desc: '黄/青/粉/蓝等经典调色盘，点击即可直接打字记事并实时保存',
    sizes: ['2x2', '2x3'],
    defaultSize: '2x2'
  },
  {
    type: 'quote',
    name: '金句与语音合成朗读',
    icon: Quote,
    desc: '#每日一句灵感名言，中英对照，一键由系统朗读发声并随机刷新',
    sizes: ['2x1', '4x1'],
    defaultSize: '2x1'
  },
  {
    type: 'launcher',
    name: '快捷书签与分类标签',
    icon: Command,
    desc: '高辨识度苹果风彩色圆角小块，点击直达常用网页或本地工具池',
    sizes: ['2x2', '4x2'],
    defaultSize: '2x2'
  },
  {
    type: 'weather',
    name: '天气与习惯专注打卡',
    icon: Sun,
    desc: '当地气温与空气质量 (AQI) + 周日一二三四五六 7日习惯打卡矩阵',
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
   1. Control Hub / Settings Window (设置页面：必须是完全正常、清晰高对比的实体窗口)
   ======================================================== */
function ControlHub({ theme, setTheme }) {
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'manage'
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
    { id: 'deepsea', name: '青蓝深海 (Teal Glass)', color: '#264653' },
    { id: 'graphite', name: '黑晶暗夜 (Dark Graphite)', color: '#23262C' },
    { id: 'glass', name: '通透晨霜 (Frosted Light)', color: '#E5E5E7' }
  ];

  return (
    <div className="w-full h-full bg-[#1C1C1E] text-white flex flex-col justify-between select-none font-sans overflow-hidden border-t border-white/10">
      {/* Top Navigation / Tab Header */}
      <div className="px-6 py-4 bg-[#252529] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-gray-950 font-black text-lg shadow-md shadow-cyan-500/20">
            
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>MacWidgets 小组件设置中心</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                100% 独立多模块架构
              </span>
            </h1>
            <p className="text-xs text-white/60">正常实体窗口设置，彻底告别背景透明叠加 · 小组件独立固定于桌面</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'gallery' ? 'bg-cyan-400 text-gray-950 shadow-sm' : 'text-white/70 hover:text-white'
            }`}
          >
            <Sparkles size={14} /> 组件仓库 (添加)
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'manage' ? 'bg-cyan-400 text-gray-950 shadow-sm' : 'text-white/70 hover:text-white'
            }`}
          >
            <Layers size={14} /> 桌面布局与锁定 ({activeWidgets.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden p-6">
        {activeTab === 'gallery' ? (
          /* TAB 1: Widget Gallery Grid */
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
                        ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border-cyan-400 shadow-lg shadow-cyan-500/10 scale-[1.01]'
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
                          <span className="text-[11px] text-cyan-300/80 font-mono">支持规格: {w.sizes.join(', ')}</span>
                        </div>
                      </div>
                      {isSelected && <Check size={18} className="text-cyan-400" />}
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">{w.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Add Bar for Gallery */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between bg-[#252529] p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">已选组件: <span className="text-cyan-300">{selectedWidget.name}</span></span>
                <span className="text-xs text-white/50">请挑选卡片尺寸:</span>
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
          /* TAB 2: Desktop Layout & Settings Manager */
          <div className="h-full flex flex-col justify-between overflow-hidden">
            <div className="space-y-6 overflow-y-auto pr-2">
              {/* Desktop Lock Section (Core Logic) */}
              <div className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
                isLocked ? 'bg-cyan-500/15 border-cyan-400/60 shadow-lg shadow-cyan-500/10' : 'bg-[#2C2C30] border-white/10'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLocked ? 'bg-cyan-400 text-gray-950' : 'bg-white/10 text-white'}`}>
                    {isLocked ? <Lock size={24} /> : <Unlock size={24} />}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <span>{isLocked ? '🔒 所有小组件已锁定在桌面底层 (防误触保护中)' : '🔓 桌面小组件布局未锁定 (可自由拖放)'}</span>
                      {isLocked && <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-400 text-gray-950 font-black">极致苹果逻辑</span>}
                    </h3>
                    <p className="text-xs text-white/70 mt-1 leading-normal">
                      {isLocked
                        ? '当你调整好各个模块的位置后开启锁定，卡片将如苹果小组件一样牢牢固定于壁纸底层，双击鼠标或打字均不会发生移动！'
                        : '当前为可调布局状态，鼠标在桌面上直接按住任何卡片的边缘或背景即可随心拖动排布。排好后建议点击右侧开启锁定！'}
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
                  <span>{isLocked ? '点击解锁 (调整位置)' : '点击锁定所有模块位置'}</span>
                </button>
              </div>

              {/* Theme Selector Section */}
              <div className="p-5 rounded-2xl bg-[#2C2C30] border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Palette size={16} className="text-cyan-300" />
                    <span>全局卡片毛玻璃质感与配色主题</span>
                  </h3>
                  <p className="text-xs text-white/60 mt-1">改变所有桌面模块的磨砂透明背景与主题色标</p>
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

              {/* Active Widgets List Table */}
              <div>
                <h3 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
                  <LayoutGrid size={16} className="text-cyan-300" />
                  <span>已放置在桌面的独立模块卡片清单 ({activeWidgets.length})</span>
                </h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
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
                            (屏幕坐标 X: {Math.round(w.x)}, Y: {Math.round(w.y)})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFocusWidget(w.id)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white/90 transition-all flex items-center gap-1 font-bold"
                            title="聚焦定位该卡片"
                          >
                            <Eye size={13} /> 定位卡片
                          </button>
                          <button
                            onClick={() => handleToggleTop(w.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${
                              w.alwaysOnTop ? 'bg-amber-400 text-gray-950 border-amber-400' : 'bg-white/10 text-white/70 border-white/10 hover:text-white'
                            }`}
                            title={w.alwaysOnTop ? '当前已开启置顶' : '点击将该模块置顶'}
                          >
                            <Pin size={13} /> {w.alwaysOnTop ? '已置顶' : '置顶层'}
                          </button>
                          <button
                            onClick={() => handleRemoveWidget(w.id)}
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white transition-all ml-2"
                            title="从桌面上移除此模块"
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

            {/* Bottom Status note */}
            <div className="pt-3 mt-3 border-t border-white/10 text-xs text-white/50 flex items-center justify-between">
              <span>💡 小提示: 右键任务栏或托盘图标同样可以秒开/解锁卡片位置</span>
              <span className="text-cyan-300/80 font-mono">MacWidgets v2.0 · Solid Opaque Settings Engine</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================
   2. Standalone Individual Widget Window (真正的单模块桌面小组件)
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
      <div className={`w-full h-full rounded-[22px] widget-island-card relative flex flex-col justify-between overflow-hidden ${isLocked ? 'no-drag-area cursor-default' : 'drag-area cursor-move'}`}>
        {/* Top-right floating controls (only active/visible when NOT locked or on hover) */}
        {!isLocked && (
          <div className="widget-floating-actions no-drag-area">
            <button
              onClick={handleToggleTop}
              className={`tool-pill-btn ${isTop ? 'bg-amber-400 text-gray-950 font-bold' : ''}`}
              title={isTop ? '当前已置顶于最前面' : '点击置顶该卡片'}
            >
              <Pin size={11} />
            </button>
            <button
              onClick={handleToggleSize}
              className="tool-pill-btn"
              title="切换规格大小"
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
        )}

        {/* Locked status badge when hovered if locked */}
        {isLocked && (
          <div className="widget-locked-badge no-drag-area">
            <Lock size={10} className="text-cyan-300" />
          </div>
        )}

        {/* Widget Content Body */}
        <div className="w-full h-full no-drag-area">
          {renderInnerWidget()}
        </div>
      </div>
    </div>
  );
}
