import React, { useState, useEffect } from 'react';
import { StickyNote, Palette, Sparkles } from 'lucide-react';

const noteThemes = [
  { id: 'yellow', bg: 'rgba(254, 228, 64, 0.85)', text: '#1A1A1A', border: 'rgba(254, 228, 64, 1)' },
  { id: 'mint', bg: 'rgba(0, 245, 212, 0.85)', text: '#0A2E28', border: 'rgba(0, 245, 212, 1)' },
  { id: 'pink', bg: 'rgba(241, 91, 181, 0.85)', text: '#2E0A20', border: 'rgba(241, 91, 181, 1)' },
  { id: 'teal', bg: 'rgba(38, 70, 83, 0.85)', text: '#FFFFFF', border: 'rgba(255, 255, 255, 0.3)' },
  { id: 'blue', bg: 'rgba(58, 134, 255, 0.85)', text: '#FFFFFF', border: 'rgba(255, 255, 255, 0.3)' },
];

export default function NoteWidget({ id = 'default-note', size = '2x2', initialContent = '' }) {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem(`macwidgets-note-${id}`);
    return saved !== null ? saved : (initialContent || "📌 快捷灵感与记事本\n\n1. 随时记录下灵感与备忘\n2. 点击右上角调色盘更改颜色\n3. 输入内容将即时本地持久保存\n4. 复制 Mac 经典桌面便签体验！");
  });

  const [themeIndex, setThemeIndex] = useState(() => {
    const savedTheme = localStorage.getItem(`macwidgets-note-theme-${id}`);
    return savedTheme ? parseInt(savedTheme, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem(`macwidgets-note-${id}`, content);
  }, [content, id]);

  useEffect(() => {
    localStorage.setItem(`macwidgets-note-theme-${id}`, themeIndex);
  }, [themeIndex, id]);

  const currentTheme = noteThemes[themeIndex % noteThemes.length];

  return (
    <div
      className="w-full h-full rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 shadow-xl"
      style={{
        background: currentTheme.bg,
        color: currentTheme.text,
        border: `1px solid ${currentTheme.border}`,
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10" style={{ borderColor: currentTheme.text === '#FFFFFF' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }}>
        <div className="flex items-center gap-1.5 font-bold text-xs opacity-90 tracking-wider">
          <StickyNote size={15} />
          <span>桌面记事卡 ({id.includes('-') ? id.split('-')[1] : '1'})</span>
        </div>
        <div className="flex items-center gap-1">
          {noteThemes.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setThemeIndex(idx)}
              className={`w-4 h-4 rounded-full border transition-transform ${
                idx === themeIndex ? 'scale-125 ring-2 ring-white/80 shadow-md' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ background: t.bg, borderColor: t.border }}
              title={`切换为${t.id}色`}
            />
          ))}
        </div>
      </div>

      {/* Note Content Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="在此键入便签文本..."
        className="note-textarea select-text"
        style={{ color: currentTheme.text }}
      />

      {/* Footer */}
      <div className="pt-2 flex items-center justify-between text-[11px] opacity-65 border-t border-black/5" style={{ borderColor: currentTheme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
        <span>实时自动保存</span>
        <span className="flex items-center gap-1">
          <Sparkles size={11} />
          {content.length} 字
        </span>
      </div>
    </div>
  );
}
