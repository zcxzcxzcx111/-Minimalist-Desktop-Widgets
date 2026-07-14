import React, { useState, useEffect } from 'react';
import { CheckCircle2, Plus, Trash2, ListTodo } from 'lucide-react';

const defaultTodos = [
  { id: 1, text: '洗衣服整理衣橱', completed: false },
  { id: 2, text: '丢垃圾与清理桌面便签', completed: false },
  { id: 3, text: '完成 MacWidgets Windows 架构设计', completed: true },
  { id: 4, text: '晚间健身开阔思维 30分钟', completed: false },
];

export default function TodoWidget({ size = '2x2' }) {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('macwidgets-todos');
    return saved ? JSON.parse(saved) : defaultTodos;
  });
  const [newText, setNewText] = useState('');

  useEffect(() => {
    localStorage.setItem('macwidgets-todos', JSON.stringify(todos));
  }, [todos]);

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id, e) => {
    e.stopPropagation();
    setTodos(todos.filter(t => t.id !== id));
  };

  const addTodo = (e) => {
    if (e.key === 'Enter' && newText.trim()) {
      setTodos([{ id: Date.now(), text: newText.trim(), completed: false }, ...todos]);
      setNewText('');
    }
  };

  const remainingCount = todos.filter(t => !t.completed).length;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ListTodo size={18} className="text-cyan-300" />
          <span className="font-bold text-white tracking-wide text-sm">每日待办事项</span>
        </div>
        <span className="text-2xl font-black text-cyan-300 leading-none">
          {remainingCount}
        </span>
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-y-auto my-2 pr-1 space-y-2">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 text-xs">
            <span>🎉 所有待办都已完成</span>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              onClick={() => toggleTodo(todo.id)}
              className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                todo.completed
                  ? 'bg-black/15 border-white/5 opacity-60'
                  : 'bg-white/10 border-white/15 hover:bg-white/15 hover:border-white/25 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {}}
                  className="todo-checkbox"
                />
                <span
                  className={`text-sm font-medium truncate ${
                    todo.completed ? 'line-through text-white/50' : 'text-white'
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={(e) => deleteTodo(todo.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-red-400 transition-all"
                title="删除待办"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add new todo bar */}
      <div className="relative flex items-center pt-1 border-t border-white/10">
        <Plus size={16} className="absolute left-2.5 text-white/40" />
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={addTodo}
          placeholder="添加新待办，按 Enter 回车保存..."
          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/25 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
        />
      </div>
    </div>
  );
}
