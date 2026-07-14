import React, { useState, useEffect } from 'react';
import { StickyNote, Palette, Sparkles } from 'lucide-react';

const noteColors = [
  { id: 'teal', bg: 'rgba(35, 68, 78, 0.90)', border: 'rgba(0, 245, 212, 0.4)', text: '#FFFFFF', name: '苹果青' },
  { id: 'yellow', bg: 'rgba(235, 195, 80, 0.92)', border: 'rgba(255, 255, 255, 0.5)', text: '#1A1A1A', name: '便签黄' },
  { id: 'dark', bg: 'rgba(28, 30, 35, 0.94)', border: 'rgba(255, 255, 255, 0.2)', text: '#FFFFFF', name: '石墨黑' },
  { id: 'pink', bg: 'rgba(220, 110, 135, 0.90)', border: 'rgba(255, 255, 255, 0.4)', text: '#FFFFFF', name: '蜜桃粉' },
];

export default function NoteWidget({ id = 'default', size = '2x2' }) {
  const [content, setContent] = useState(() => {
    return localStorage.getItem(`macwidgets-note-${id}`) || 'MacBook 使用与灵感速记：\n1. 桌面便签即打即存\n2. 锁屏防误触位置固定\n3. 连续曲率圆角 1:1\n4. 随时在控制台管理与更换主题色';
  });

  const [colorIdx, setColorIdx] = useState(0);

  useEffect(() => {
    localStorage.setItem(`macwidgets-note-${id}`, content);
  }, [content, id]);

  const currentColor = noteColors[colorIdx];

  const cycleColor = () => {
    setColorIdx((prev) => (prev + 1) % noteColors.length);
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-between select-none p-2 rounded-[22px] transition-all"
      style={{ background: currentColor.bg, borderColor: currentColor.border, color: currentColor.text }}
    >
      <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
        <div className="flex items-center gap-1.5">
          <StickyNote size={15} />
          <span className="text-xs font-extrabold tracking-wide">快捷灵感记事 ({currentColor.name})</span>
        </div>
        <button
          onClick={cycleColor}
          className="p-1 rounded-lg hover:bg-white/20 transition-all flex items-center gap-1 text-[11px]"
          title="点击更换便签色系"
        >
          <Palette size={13} />
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="在此快速记录灵感或会议纪要..."
        className="note-textarea font-sans p-1 leading-relaxed"
        style={{ color: currentColor.text }}
      />

      <div className="pt-1.5 border-t flex items-center justify-between text-[10px] opacity-60" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <span>打字即时自动持久化保存</span>
        <span>{content.length} 字</span>
      </div>
    </div>
  );
}
