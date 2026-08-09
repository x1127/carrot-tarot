import { useState } from 'react';
import { ChevronRight, Shuffle, ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import StarField from '../components/StarField';
import ReadingResult from '../components/ReadingResult';
import { useContent } from '../hooks/useContent';
import { spreads, allCards, getCardById } from '../data';
import type { DrawnCard, ReadingRecord } from '../data/types';
import { drawCards, useHistoryStore } from '../store/history';

type Step = 'select' | 'question' | 'drawing' | 'result';

export default function Divine() {
  const [step, setStep] = useState<Step>('select');
  const [spreadId, setSpreadId] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [freeCount, setFreeCount] = useState(3);
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [revealing, setRevealing] = useState(false);
  const { divine } = useContent();

  const addRecord = useHistoryStore((s) => s.addRecord);

  const selectedSpread = spreads.find((s) => s.id === spreadId);
  const cardCount = selectedSpread?.fixed
    ? selectedSpread.cardCount
    : freeCount;

  const handleSelectSpread = (id: string) => {
    setSpreadId(id);
    setStep('question');
  };

  const handleDraw = () => {
    setStep('drawing');
    setRevealing(true);
    const allIds = allCards.map((c) => c.id);
    const drawn = drawCards(allIds, cardCount);
    // 附带位置信息
    const withPositions = drawn.map((c, i) => ({
      ...c,
      positionLabel: selectedSpread?.positions[i]?.label,
      positionMeaning: selectedSpread?.positions[i]?.meaning,
    }));
    // 模拟洗牌动画时长
    setTimeout(() => {
      setCards(withPositions);
      setRevealing(false);
      setStep('result');
    }, 1800);
  };

  const handleRestart = () => {
    setStep('select');
    setSpreadId('');
    setQuestion('');
    setCards([]);
  };

  const handleSave = (record: ReadingRecord) => {
    addRecord(record);
  };

  return (
    <div className="relative min-h-screen">
      <StarField />
      <Navigation />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* 步骤标题 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
            <span className="text-gold-gradient">{divine.title}</span>
          </h1>
          <StepIndicator step={step} stepLabels={divine.steps} />
        </div>

        {/* Step 1: 选择牌阵 */}
        {step === 'select' && (
          <div className="grid sm:grid-cols-2 gap-5 animate-fade-in-up">
            {spreads.map((spread, i) => (
              <button
                key={spread.id}
                onClick={() => handleSelectSpread(spread.id)}
                className="group text-left glass-card rounded-2xl p-6 hover:border-[#d4af37]/60 hover:-translate-y-1 transition-all"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-serif font-semibold text-[#e8e3f3]">
                    {spread.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#9d4edd]/20 text-[#9d4edd]">
                    {spread.fixed ? `${spread.cardCount} 张` : '自选张数'}
                  </span>
                </div>
                <p className="text-[#e8e3f3]/60 text-sm leading-relaxed mb-4">
                  {spread.description}
                </p>
                <span className="inline-flex items-center text-[#d4af37] text-sm">
                  选择 <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: 问题输入 */}
        {step === 'question' && selectedSpread && (
          <div className="max-w-xl mx-auto glass-card rounded-2xl p-8 animate-fade-in-up">
            <button
              onClick={() => setStep('select')}
              className="flex items-center text-[#e8e3f3]/50 hover:text-[#e8e3f3] text-sm mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> {divine.reselectSpread}
            </button>

            <h3 className="text-2xl font-serif font-semibold text-[#e8e3f3] mb-2">
              {selectedSpread.name}
            </h3>
            <p className="text-[#e8e3f3]/50 text-sm mb-6">{selectedSpread.description}</p>

            <label className="block text-[#e8e3f3]/70 text-sm mb-2">
              {divine.questionLabel}
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder={divine.questionPlaceholder}
              className="w-full px-4 py-3 bg-black/30 rounded-xl border border-[#d4af37]/20 text-[#e8e3f3] placeholder-[#e8e3f3]/30 focus:outline-none focus:border-[#d4af37]/60 resize-none transition-colors"
            />

            {/* 自由抽牌选择张数 */}
            {!selectedSpread.fixed && (
              <div className="mt-6">
                <label className="block text-[#e8e3f3]/70 text-sm mb-2">
                  {divine.freeCountLabel.replace('{n}', String(freeCount))}
                </label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={freeCount}
                  onChange={(e) => setFreeCount(Number(e.target.value))}
                  className="w-full accent-[#d4af37]"
                />
              </div>
            )}

            <button
              onClick={handleDraw}
              className="w-full mt-8 py-3.5 bg-gradient-to-r from-[#9d4edd] to-[#6a2c91] text-white rounded-xl font-medium hover:shadow-xl hover:shadow-[#9d4edd]/40 transition-all flex items-center justify-center gap-2"
            >
              <Shuffle className="w-5 h-5" />
              {divine.drawButtonText}
            </button>
          </div>
        )}

        {/* Step 3: 洗牌动画 */}
        {step === 'drawing' && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
            <div className="relative" style={{ width: 200, height: 280 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute w-28 h-44 rounded-lg border-2 border-[#d4af37]/50 bg-gradient-to-br from-[#2d1b4e] via-[#1a0b2e] to-[#0d0518] flex items-center justify-center shadow-lg shadow-[#9d4edd]/30"
                  style={{
                    left: `${50 + Math.sin(i) * 30}%`,
                    top: `${50 + Math.cos(i) * 20}%`,
                    transform: `translate(-50%, -50%) rotate(${(i - 2) * 8}deg)`,
                    animation: `float-slow ${1 + i * 0.2}s ease-in-out infinite`,
                  }}
                >
                  <span className="text-[#d4af37] text-3xl">✦</span>
                </div>
              ))}
            </div>
            <p className="mt-10 text-[#d4af37] font-serif text-lg animate-pulse">
              {divine.shufflingText}
            </p>
          </div>
        )}

        {/* Step 4: 结果 */}
        {step === 'result' && cards.length > 0 && (
          <ReadingResult
            spreadId={spreadId}
            question={question || undefined}
            cards={cards}
            onRestart={handleRestart}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

function StepIndicator({ step, stepLabels }: { step: Step; stepLabels: { select: string; question: string; drawing: string; result: string } }) {
  const steps: { key: Step; label: string }[] = [
    { key: 'select', label: stepLabels.select },
    { key: 'question', label: stepLabels.question },
    { key: 'drawing', label: stepLabels.drawing },
    { key: 'result', label: stepLabels.result },
  ];
  const activeIdx = steps.findIndex((s) => s.key === step);

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <span
            className={`text-xs px-3 py-1 rounded-full transition-all ${
              i === activeIdx
                ? 'bg-[#d4af37]/20 text-[#d4af37]'
                : i < activeIdx
                ? 'text-[#9d4edd]/60'
                : 'text-[#e8e3f3]/30'
            }`}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && <span className="text-[#e8e3f3]/20 text-xs">→</span>}
        </div>
      ))}
    </div>
  );
}
