import React, { useState } from 'react';
import { Camera, FileText, Scissors, Image, Share2, Terminal, BookOpen, Sparkles, Command } from 'lucide-react';

export default function LauncherWidget({ size = '2x2' }) {
  const [shortcuts] = useState([
    { id: 1, name: '拍摄', icon: Camera, desc: '相机与相册导入' },
    { id: 2, name: '文案', icon: FileText, desc: 'Notion 文稿编辑' },
    { id: 3, name: '剪辑', icon: Scissors, desc: 'Premiere Pro' },
    { id: 4, name: '作图', icon: Image, desc: 'Photoshop / Figma' },
    { id: 5, name: '公众号', icon: Share2, desc: '后台发文管理' },
    { id: 6, name: '软件研究', icon: Terminal, desc: 'VS Code & Node' },
    { id: 7, name: '学习参考', icon: BookOpen, desc: '小红书灵感簿' },
    { id: 8, name: 'AI学习', icon: Sparkles, desc: 'ChatGPT & Gemini' },
  ]);

  const handleLaunch = (item) => {
    console.log('Launch:', item.name);
  };

  if (size === '2x1') {
    return (
      <div className="w-full h-full flex flex-col justify-between select-none p-1">
        <div className="flex items-center justify-between border-b border-white/15 pb-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Command size={14} className="text-cyan-300" /> 快捷指令方格
          </span>
          <span className="text-[10px] text-white/50">点击直达</span>
        </div>
        <div className="grid grid-cols-4 gap-2 pt-1">
          {shortcuts.slice(0, 4).map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                onClick={() => handleLaunch(s)}
                className="py-2 rounded-xl bg-white/10 hover:bg-cyan-400 hover:text-gray-950 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-sm"
              >
                <Icon size={16} />
                <span className="text-[11px] font-bold">{s.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Exact 1:1 replica of Photo 2 second red circle (`2x2` squircle with 8 category rounded buttons)
  return (
    <div className="w-full h-full flex flex-col justify-between select-none p-1">
      <div className="flex items-center justify-between border-b border-white/15 pb-2">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <Command size={14} className="text-cyan-300" /> 快捷工作流与指令方格
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30">
          8 项快启
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2.5 my-auto pt-2">
        {shortcuts.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              onClick={() => handleLaunch(s)}
              className="py-2.5 px-1 rounded-[16px] bg-white/10 hover:bg-cyan-400 hover:text-gray-950 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-sm border border-white/10"
              title={s.desc}
            >
              <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center">
                <Icon size={18} />
              </div>
              <span className="text-[11px] font-bold truncate w-full text-center">{s.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
