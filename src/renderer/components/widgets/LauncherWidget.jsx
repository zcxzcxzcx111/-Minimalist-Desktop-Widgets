import React, { useState, useEffect } from 'react';
import { Folder, Globe, Sparkles, Plus, ExternalLink, Command, ShieldCheck, Film, Image } from 'lucide-react';

const defaultTags = [
  { id: 1, name: '马上整理', color: '#00F5D4', text: '#0A2E28', type: 'action', desc: '整洁桌面' },
  { id: 2, name: '不想上班', color: '#FEE440', text: '#1A1A1A', type: 'url', url: 'https://bilibili.com' },
  { id: 3, name: '工作文档', color: '#9B5DE5', text: '#FFFFFF', type: 'url', url: 'https://docs.qq.com' },
  { id: 4, name: '电脑壁纸', color: '#00BBF9', text: '#FFFFFF', type: 'action', desc: '图片专区' },
  { id: 5, name: '简历精修', color: '#F15BB5', text: '#FFFFFF', type: 'action', desc: '求职备用' },
  { id: 6, name: '重要文件', color: '#00F5D4', text: '#0A2E28', type: 'action', desc: '加密存储' },
  { id: 7, name: '视频剪辑', color: '#FF99C8', text: '#2E0A20', type: 'action', desc: 'Premiere' },
  { id: 8, name: 'AI学习参考', color: '#A9DEF9', text: '#0A2E28', type: 'url', url: 'https://github.com' },
  { id: 9, name: '小红书灵感', color: '#FF4D4D', text: '#FFFFFF', type: 'url', url: 'https://xiaohongshu.com' },
];

export default function LauncherWidget({ size = '2x2' }) {
  const [tags, setTags] = useState(() => {
    const saved = localStorage.getItem('macwidgets-launcher');
    return saved ? JSON.parse(saved) : defaultTags;
  });

  const [activeMessage, setActiveMessage] = useState('');

  const handleItemClick = (item) => {
    if (item.url) {
      setActiveMessage(`🌐 正在为您打开网页: ${item.name}`);
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.require) {
          try {
            window.require('electron').shell.openExternal(item.url);
          } catch {
            window.open(item.url, '_blank');
          }
        } else {
          window.open(item.url, '_blank');
        }
        setActiveMessage('');
      }, 400);
    } else {
      setActiveMessage(`⚡ 已激活桌面指令: ${item.name}`);
      setTimeout(() => setActiveMessage(''), 1500);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
          <Command size={15} className="text-cyan-300" />
          <span>快捷分类 & 文件夹看板</span>
        </div>
        <span className="text-[11px] text-white/50">{tags.length} 个快捷项</span>
      </div>

      {/* Grid of tags */}
      <div className="flex-1 overflow-y-auto my-2 pr-1 grid grid-cols-3 gap-2 items-start">
        {tags.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-white/20 shadow-md transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
            style={{ background: item.color, color: item.text }}
          >
            <span className="text-xs font-extrabold truncate max-w-full tracking-tight">
              {item.name}
            </span>
            <span className="text-[10px] opacity-75 font-medium mt-0.5 truncate max-w-full">
              {item.type === 'url' ? 'Link ↗' : item.desc || 'Folder'}
            </span>
          </button>
        ))}
      </div>

      {/* Footer status bar */}
      <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px]">
        {activeMessage ? (
          <span className="text-cyan-300 font-bold animate-pulse truncate">{activeMessage}</span>
        ) : (
          <span className="text-white/60 truncate">提示: 点击小标签直达文件分类/链接</span>
        )}
      </div>
    </div>
  );
}
