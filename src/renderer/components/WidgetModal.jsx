import React, { useState } from 'react';
import { X, Clock, Battery, ListTodo, StickyNote, Quote, Command, Sun, Plus, Check } from 'lucide-react';

const availableWidgets = [
  {
    type: 'clock',
    name: '时钟与农历日历',
    icon: Clock,
    desc: '大字号数字时钟 + 农历日历 + 周日历视图',
    sizes: ['2x1', '2x2'],
    defaultSize: '2x1'
  },
  {
    type: 'battery',
    name: '设备电量与环形监控',
    icon: Battery,
    desc: '复刻 Apple 环形仪表盘，实时显示电量百分比与周边设备',
    sizes: ['1x1', '2x2'],
    defaultSize: '2x2'
  },
  {
    type: 'todo',
    name: '每日待办清单 (Todo)',
    icon: ListTodo,
    desc: '直接在桌面上勾选任务、划线消去、自动保存进度',
    sizes: ['2x2', '4x2'],
    defaultSize: '2x2'
  },
  {
    type: 'note',
    name: '快捷记事便签薄',
    icon: StickyNote,
    desc: '多颜色调色盘（黄/青/粉/蓝/深海），输入文字即时持久保存',
    sizes: ['2x2', '2x3'],
    defaultSize: '2x2'
  },
  {
    type: 'quote',
    name: '每日金句与语音朗读',
    icon: Quote,
    desc: '#每日一句，中英对照 + 苹果/编程精选，支持朗读与切换',
    sizes: ['2x1'],
    defaultSize: '2x1'
  },
  {
    type: 'launcher',
    name: '快捷分类与指令标签',
    icon: Command,
    desc: '色彩鲜艳的圆角卡片，一键触达网页、文件夹与工作流',
    sizes: ['2x2', '4x2'],
    defaultSize: '2x2'
  },
  {
    type: 'weather',
    name: '极简天气与习惯打卡',
    icon: Sun,
    desc: '气温与空气质量看板 + 7日习惯打卡进度矩阵',
    sizes: ['2x1', '2x2'],
    defaultSize: '2x1'
  }
];

export default function WidgetModal({ onClose, onAddWidget }) {
  const [selectedWidget, setSelectedWidget] = useState(availableWidgets[0]);
  const [selectedSize, setSelectedSize] = useState(availableWidgets[0].defaultSize);

  const handleSelectWidget = (w) => {
    setSelectedWidget(w);
    setSelectedSize(w.defaultSize);
  };

  const handleAdd = () => {
    onAddWidget(selectedWidget.type, selectedSize);
    onClose();
  };

  return (
    <div className="modal-overlay select-none" onClick={onClose}>
      <div
        className="w-[760px] max-h-[85vh] rounded-3xl bg-[#1C1C1E]/95 border border-white/20 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">添加组件库 · MacWidgets Gallery</h2>
            <p className="text-xs text-white/60 mt-0.5">选择你喜欢的功能模块和尺寸比例，一键添置到桌面或网格看板中</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left List */}
          <div className="w-[280px] border-r border-white/10 p-4 overflow-y-auto space-y-2">
            {availableWidgets.map((w) => {
              const Icon = w.icon;
              const isSelected = selectedWidget.type === w.type;
              return (
                <div
                  key={w.type}
                  onClick={() => handleSelectWidget(w)}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                      : 'bg-white/5 border-transparent text-white/75 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-cyan-400 text-gray-950' : 'bg-white/10 text-white'}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="text-sm font-bold truncate">{w.name}</h3>
                    <span className="text-[10px] text-white/50 block truncate">{w.sizes.join(', ')} 可选</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Preview & Options */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between bg-black/20">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">选定组件</span>
                <span className="text-sm font-extrabold text-white">{selectedWidget.name}</span>
              </div>
              <p className="text-xs text-white/70 mb-6 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                💡 {selectedWidget.desc}
              </p>

              {/* Size Selector */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-2">
                  选择卡片网格尺寸 (Size)
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedWidget.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl font-bold text-sm border transition-all flex items-center gap-2 ${
                        selectedSize === size
                          ? 'bg-cyan-400 text-gray-950 border-cyan-400 shadow-md scale-105'
                          : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20'
                      }`}
                    >
                      <span>{size}</span>
                      {selectedSize === size && <Check size={14} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Add Action */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/40">已选: {selectedWidget.name} ({selectedSize})</span>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 text-gray-950 font-black text-sm shadow-lg shadow-cyan-400/40 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={18} strokeWidth={3} />
                <span>立即添加至桌面</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
