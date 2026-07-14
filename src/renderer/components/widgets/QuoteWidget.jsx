import React, { useState } from 'react';
import { Volume2, RefreshCw, Quote as QuoteIcon } from 'lucide-react';

const quotesList = [
  {
    en: "Hard work beats talent when talent doesn't work hard.",
    zh: "当天赋不努力时，勤奋会击败天赋。",
    author: "Tim Notke"
  },
  {
    en: "Simplicity is the ultimate sophistication.",
    zh: "至简即至繁。",
    author: "Leonardo da Vinci / Apple"
  },
  {
    en: "Stay hungry, stay foolish.",
    zh: "求知若饥，虚心若愚。",
    author: "Steve Jobs"
  },
  {
    en: "Design is not just what it looks like and feels like. Design is how it works.",
    zh: "设计不仅仅是外观和感觉，设计是它是如何工作的。",
    author: "Steve Jobs"
  },
  {
    en: "Your time is limited, so don't waste it living someone else's life.",
    zh: "你的时间是有限的，不要浪费在重复别人的生活上。",
    author: "Steve Jobs"
  },
  {
    en: "Action is the foundational key to all success.",
    zh: "行动是通往所有成功的根本钥匙。",
    author: "Pablo Picasso"
  }
];

export default function QuoteWidget({ size = '2x1' }) {
  const [index, setIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const current = quotesList[index % quotesList.length];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % quotesList.length);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(current.en);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/70">
        <div className="flex items-center gap-1.5 text-cyan-300">
          <QuoteIcon size={14} />
          <span>#每日一句 · Daily Inspiration</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeak}
            className={`p-1.5 rounded-lg border transition-all ${
              isSpeaking
                ? 'bg-cyan-400 text-gray-950 border-cyan-400 animate-pulse'
                : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20'
            }`}
            title="朗读金句"
          >
            <Volume2 size={14} />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-white/10 text-white/80 border border-white/15 hover:bg-white/20 hover:rotate-180 transition-all duration-300"
            title="切换下一句"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Quote Content */}
      <div className="my-auto py-2">
        <p className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
          "{current.en}"
        </p>
        <p className="text-xs sm:text-sm text-cyan-200 mt-1 font-medium opacity-90">
          {current.zh}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-end text-[11px] text-white/50 italic font-medium">
        — {current.author}
      </div>
    </div>
  );
}
