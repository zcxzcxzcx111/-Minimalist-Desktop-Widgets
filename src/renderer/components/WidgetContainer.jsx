import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Maximize2, Move } from 'lucide-react';
import ClockWidget from './widgets/ClockWidget';
import BatteryWidget from './widgets/BatteryWidget';
import TodoWidget from './widgets/TodoWidget';
import NoteWidget from './widgets/NoteWidget';
import QuoteWidget from './widgets/QuoteWidget';
import LauncherWidget from './widgets/LauncherWidget';
import WeatherWidget from './widgets/WeatherWidget';

export default function WidgetContainer({
  widget,
  mode,
  isDragLocked,
  onRemove,
  onToggleSize
}) {
  const [position, setPosition] = useState(() => {
    const savedPos = localStorage.getItem(`macwidgets-pos-${widget.id}`);
    return savedPos ? JSON.parse(savedPos) : (widget.defaultPos || { x: 50, y: 50 });
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (mode === 'floating') {
      localStorage.setItem(`macwidgets-pos-${widget.id}`, JSON.stringify(position));
    }
  }, [position, mode, widget.id]);

  const handleMouseDown = (e) => {
    if (mode !== 'floating' || isDragLocked) return;
    // Don't drag if clicking buttons or textarea or checkboxes inside
    const tagName = e.target.tagName.toLowerCase();
    if (['button', 'input', 'textarea', 'svg', 'path', 'circle'].includes(tagName) || e.target.closest('button')) {
      return;
    }

    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 160, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 160, e.clientY - dragOffset.current.y))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Render internal widget component by type
  const renderInnerWidget = () => {
    switch (widget.type) {
      case 'clock':
        return <ClockWidget size={widget.size} />;
      case 'battery':
        return <BatteryWidget size={widget.size} />;
      case 'todo':
        return <TodoWidget size={widget.size} />;
      case 'note':
        return <NoteWidget id={widget.id} size={widget.size} />;
      case 'quote':
        return <QuoteWidget size={widget.size} />;
      case 'launcher':
        return <LauncherWidget size={widget.size} />;
      case 'weather':
        return <WeatherWidget size={widget.size} />;
      default:
        return <div>Widget {widget.type}</div>;
    }
  };

  // Determine size class
  const sizeClass = `widget-size-${widget.size || '2x2'}`;

  // Style in floating mode vs dashboard mode
  const floatingStyle = mode === 'floating' ? {
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: isDragging ? 100 : 10
  } : {};

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`widget-card ${sizeClass} ${mode === 'floating' && !isDragLocked ? 'cursor-grab' : ''}`}
      style={floatingStyle}
    >
      {/* Hover Control Tools */}
      <div className="widget-hover-tools">
        {mode === 'floating' && !isDragLocked && (
          <div className="tool-icon-btn cursor-move" title="按住拖放">
            <Move size={12} />
          </div>
        )}
        <div
          onClick={() => onToggleSize(widget.id)}
          className="tool-icon-btn"
          title="切换卡片尺寸 (2x1 <-> 2x2 等)"
        >
          <Maximize2 size={12} />
        </div>
        <div
          onClick={() => onRemove(widget.id)}
          className="tool-icon-btn hover:bg-red-500/80"
          title="移除小组件"
        >
          <Trash2 size={12} />
        </div>
      </div>

      {/* Widget Content */}
      <div className="w-full h-full">
        {renderInnerWidget()}
      </div>
    </div>
  );
}
