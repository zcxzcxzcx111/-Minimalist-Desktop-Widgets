import React, { useState, useEffect } from 'react';
import HeaderBar from './components/HeaderBar';
import WidgetContainer from './components/WidgetContainer';
import WidgetModal from './components/WidgetModal';

const defaultWidgetsList = [
  { id: 'w-clock-1', type: 'clock', size: '2x1', defaultPos: { x: 40, y: 40 } },
  { id: 'w-quote-1', type: 'quote', size: '2x1', defaultPos: { x: 400, y: 40 } },
  { id: 'w-battery-1', type: 'battery', size: '2x2', defaultPos: { x: 40, y: 220 } },
  { id: 'w-todo-1', type: 'todo', size: '2x2', defaultPos: { x: 400, y: 220 } },
  { id: 'w-launcher-1', type: 'launcher', size: '2x2', defaultPos: { x: 760, y: 220 } },
  { id: 'w-note-1', type: 'note', size: '2x2', defaultPos: { x: 760, y: 580 } },
  { id: 'w-weather-1', type: 'weather', size: '2x1', defaultPos: { x: 40, y: 580 } }
];

export default function App() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('macwidgets-mode') || 'dashboard';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('macwidgets-theme') || 'deepsea';
  });

  const [isDragLocked, setIsDragLocked] = useState(() => {
    return localStorage.getItem('macwidgets-drag-locked') === 'true';
  });

  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('macwidgets-list');
    return saved ? JSON.parse(saved) : defaultWidgetsList;
  });

  const [showModal, setShowModal] = useState(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  useEffect(() => {
    localStorage.setItem('macwidgets-mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('macwidgets-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('macwidgets-drag-locked', String(isDragLocked));
  }, [isDragLocked]);

  useEffect(() => {
    localStorage.setItem('macwidgets-list', JSON.stringify(widgets));
  }, [widgets]);

  const addWidget = (type, size) => {
    const newWidget = {
      id: `w-${type}-${Date.now()}`,
      type,
      size,
      defaultPos: {
        x: Math.floor(Math.random() * (window.innerWidth - 380)) + 60,
        y: Math.floor(Math.random() * (window.innerHeight - 380)) + 80
      }
    };
    setWidgets([newWidget, ...widgets]);
  };

  const removeWidget = (id) => {
    setWidgets(widgets.filter(w => w.id !== id));
    localStorage.removeItem(`macwidgets-pos-${id}`);
  };

  const toggleWidgetSize = (id) => {
    setWidgets(widgets.map(w => {
      if (w.id !== id) return w;
      let nextSize = '2x2';
      if (w.size === '2x1') nextSize = '2x2';
      else if (w.size === '2x2') nextSize = '4x2';
      else if (w.size === '4x2') nextSize = '1x1';
      else if (w.size === '1x1') nextSize = '2x1';
      else nextSize = '2x2';
      return { ...w, size: nextSize };
    }));
  };

  const toggleTop = () => {
    const nextVal = !isAlwaysOnTop;
    setIsAlwaysOnTop(nextVal);
    if (typeof window !== 'undefined' && window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('window-toggle-top', nextVal);
    }
  };

  return (
    <div className={`app-container theme-${theme}`}>
      {/* Top Header Bar */}
      <HeaderBar
        mode={mode}
        setMode={setMode}
        isDragLocked={isDragLocked}
        setIsDragLocked={setIsDragLocked}
        theme={theme}
        setTheme={setTheme}
        onOpenAddModal={() => setShowModal(true)}
        isAlwaysOnTop={isAlwaysOnTop}
        toggleTop={toggleTop}
      />

      {/* Main Canvas Area */}
      <div className="canvas-wrapper">
        {mode === 'dashboard' ? (
          /* Dashboard Board Mode: macOS Sonoma Frosted Glass Board */
          <div className="dashboard-board">
            {widgets.map((w) => (
              <WidgetContainer
                key={w.id}
                widget={w}
                mode="dashboard"
                isDragLocked={true}
                onRemove={removeWidget}
                onToggleSize={toggleWidgetSize}
              />
            ))}
            {/* Quick Add Placeholder Card inside Board */}
            <div
              onClick={() => setShowModal(true)}
              className="widget-card widget-size-1x1 border-dashed border-white/20 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center cursor-pointer text-white/50 hover:text-white transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-light">+</span>
              </div>
              <span className="text-xs font-bold">添加组件</span>
            </div>
          </div>
        ) : (
          /* Floating Canvas Mode: Cards float freely on transparent desktop background */
          <div className="floating-canvas">
            {widgets.map((w) => (
              <WidgetContainer
                key={w.id}
                widget={w}
                mode="floating"
                isDragLocked={isDragLocked}
                onRemove={removeWidget}
                onToggleSize={toggleWidgetSize}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Widget Modal */}
      {showModal && (
        <WidgetModal
          onClose={() => setShowModal(false)}
          onAddWidget={addWidget}
        />
      )}
    </div>
  );
}
