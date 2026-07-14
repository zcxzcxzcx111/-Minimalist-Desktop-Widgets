import React, { useState } from 'react';
import { Volume2, RefreshCw, Quote as QuoteIcon } from 'lucide-react';

const quotesList = [
  {
    en: "Hard work beats talent when talent doesn't work hard.",
    zh: "当天赋不努力时，勤奋会击败天赋。",
    author: "Tim Notke"
  },
  {
    en: "Stay hungry, stay foolish.",
    zh: "求知若饥，虚心若愚。",
    author: "Steve Jobs"
  },
  {
    en: "Simplicity is the ultimate sophistication.",
    zh: "至繁归于至简。",
    author: "Leonardo da Vinci"
  },
  {
    en: "The best way to predict the future is to invent it.",
    zh: "预测未来最好的办法就是创造未来。",
    author: "Alan Kay"
  }
];

export default function QuoteWidget({ size = '2x1' }) {
  const [idx, setIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const current = quotesList[idx];

  const handleNext = () => {
    setIdx((prev) => (prev + 1) % quotesList.length);
  };

  const handleSpeak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(current.en + "。 " + current.zh);
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none p-1">
      {/* Top Bar exactly like Photo 1 (`#每日一句` + audio + refresh) */}
      <div className="flex items-center justify-between border-b border-white/15 pb-2">
        <div className="flex items-center gap-1.5 text-cyan-300 font-extrabold text-xs">
          <QuoteIcon size={14} />
          <span>#每日一句 · Daily Inspiration</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSpeak}
            className={`p-1 rounded-lg border transition-all ${
              isSpeaking ? 'bg-cyan-400 text-gray-950 border-cyan-400 live-pulse font-bold' : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20'
            }`}
            title="一键由系统朗读发声"
          >
            <Volume2 size={13} />
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 border border-white/15 transition-all"
            title="换一句名言"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Quote Body */}
      <div className="my-auto py-1">
        <p className="text-[13px] font-extrabold text-white leading-snug font-sans">
          "{current.en}"
        </p>
        <p className="text-xs text-cyan-300 font-medium mt-1 leading-normal">
          {current.zh}
        </p>
      </div>

      {/* Author Footer */}
      <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-mono">
        <span>— {current.author}</span>
        <span className="text-cyan-300/80">TTS Ready</span>
      </div>
    </div>
  );
}
