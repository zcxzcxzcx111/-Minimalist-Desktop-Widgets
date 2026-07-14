import React, { useState, useEffect } from 'react';
import { ListTodo, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const defaultTodos = [
  { id: 1, text: '洗衣服整理衣橱', completed: false },
  { id: 2, text: '丢垃圾与清理桌面', completed: false },
  { id: 3, text: '索尼镜头文案研究', completed: true },
  { id: 4, text: '完成视频剪辑导片', completed: false },
];

export default function TodoWidget({ size = '2x2' }) {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('macwidgets-todos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return defaultTodos;
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('macwidgets-todos', JSON.stringify(todos));
  }, [todos]);

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTodo = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);
      setInput('');
    }
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="w-full h-full flex flex-col justify-between select-none p-1">
      {/* Top Header matching Photo 1 / Photo 2 (`每日待办 2` / `job-todolist 4`) */}
      <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
        <div className="flex items-center gap-2">
          <ListTodo size={16} className="text-cyan-300" />
          <span className="text-xs font-extrabold text-white">每日待办清单 (Todo)</span>
        </div>
        <span className="text-[18px] font-black text-cyan-300 font-mono leading-none">
          {activeCount}
        </span>
      </div>

      {/* Todo Items List */}
      <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
        {todos.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/40 text-xs">
            🎉 当前无待办，回车快速添加
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between group py-1.5 px-2 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-2.5 overflow-hidden flex-1 cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <span className={`text-xs truncate transition-all ${todo.completed ? 'line-through text-white/40' : 'text-white font-bold'}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => removeTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500 hover:text-white text-white/40 transition-all"
                title="删除该条目"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Quick Input Bar */}
      <div className="pt-2 border-t border-white/10 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-cyan-300 shrink-0">
          <Plus size={14} />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={addTodo}
          placeholder="敲击回车快速添加待办..."
          className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-white/40 font-sans"
        />
      </div>
    </div>
  );
}
