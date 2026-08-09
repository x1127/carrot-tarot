import { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Plus, Trash2, Edit3 } from 'lucide-react';
import type { TarotCard } from '../../data/types';
import type { CardMeaningData } from '../../store/adminConfig';
import { useAdminConfigStore } from '../../store/adminConfig';

interface CardMeaningEditorProps {
  card: TarotCard;
  isOpen: boolean;
  onClose: () => void;
}

export default function CardMeaningEditor({ card, isOpen, onClose }: CardMeaningEditorProps) {
  const setCardMeaning = useAdminConfigStore((state) => state.setCardMeaning);
  const removeCardMeaning = useAdminConfigStore((state) => state.removeCardMeaning);
  const customMeaning = useAdminConfigStore((state) => state.config.cardMeanings[card.id]);

  const [formData, setFormData] = useState<CardMeaningData>({
    name: card.name,
    englishName: card.englishName,
    keywords: {
      upright: [...card.keywords.upright],
      reversed: [...card.keywords.reversed],
    },
    meaning: {
      upright: card.meaning.upright,
      reversed: card.meaning.reversed,
    },
  });

  const [newKeywordUpright, setNewKeywordUpright] = useState('');
  const [newKeywordReversed, setNewKeywordReversed] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 加载现有数据或默认值
      if (customMeaning) {
        setFormData({
          name: customMeaning.name || card.name,
          englishName: customMeaning.englishName || card.englishName,
          keywords: {
            upright: customMeaning.keywords?.upright || [...card.keywords.upright],
            reversed: customMeaning.keywords?.reversed || [...card.keywords.reversed],
          },
          meaning: {
            upright: customMeaning.meaning?.upright || card.meaning.upright,
            reversed: customMeaning.meaning?.reversed || card.meaning.reversed,
          },
        });
      } else {
        setFormData({
          name: card.name,
          englishName: card.englishName,
          keywords: {
            upright: [...card.keywords.upright],
            reversed: [...card.keywords.reversed],
          },
          meaning: {
            upright: card.meaning.upright,
            reversed: card.meaning.reversed,
          },
        });
      }
      setSaved(false);
    }
  }, [isOpen, card, customMeaning]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setCardMeaning(card.id, formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (customMeaning) {
      removeCardMeaning(card.id);
    }
    setFormData({
      name: card.name,
      englishName: card.englishName,
      keywords: {
        upright: [...card.keywords.upright],
        reversed: [...card.keywords.reversed],
      },
      meaning: {
        upright: card.meaning.upright,
        reversed: card.meaning.reversed,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addKeyword = (type: 'upright' | 'reversed') => {
    const keyword = type === 'upright' ? newKeywordUpright : newKeywordReversed;
    if (!keyword.trim()) return;
    
    setFormData(prev => {
      const newKeywords = { ...prev.keywords };
      if (keyword.trim() && !newKeywords[type].includes(keyword.trim())) {
        newKeywords[type] = [...newKeywords[type], keyword.trim()];
      }
      return { ...prev, keywords: newKeywords };
    });
    
    if (type === 'upright') {
      setNewKeywordUpright('');
    } else {
      setNewKeywordReversed('');
    }
  };

  const removeKeyword = (type: 'upright' | 'reversed', index: number) => {
    setFormData(prev => {
      const newKeywords = { ...prev.keywords };
      newKeywords[type] = newKeywords[type].filter((_, i) => i !== index);
      return { ...prev, keywords: newKeywords };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-purple-950 to-[#0d0518] rounded-2xl border border-purple-500/30 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">编辑牌意</h2>
              <p className="text-sm text-purple-300/70">{card.name} ({card.englishName})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-purple-300" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
          {/* 名称编辑 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-amber-500 rounded-full" />
              名称信息
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-purple-200 mb-2">中文名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-purple-900/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-purple-200 mb-2">英文名称</label>
                <input
                  type="text"
                  value={formData.englishName}
                  onChange={(e) => setFormData(prev => ({ ...prev, englishName: e.target.value }))}
                  className="w-full px-4 py-2 bg-purple-900/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>
          </section>

          {/* 标签编辑 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-amber-500 rounded-full" />
              关键词标签
            </h3>
            
            {/* 正位标签 */}
            <div className="bg-purple-900/30 rounded-xl p-4">
              <label className="block text-sm text-green-400 mb-3">正位关键词</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.keywords!.upright.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-sm text-green-300"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword('upright', index)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeywordUpright}
                  onChange={(e) => setNewKeywordUpright(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword('upright'))}
                  placeholder="输入新关键词"
                  className="flex-1 px-3 py-2 bg-purple-950/50 border border-purple-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-green-500/50"
                />
                <button
                  onClick={() => addKeyword('upright')}
                  className="px-3 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 逆位标签 */}
            <div className="bg-purple-900/30 rounded-xl p-4">
              <label className="block text-sm text-red-400 mb-3">逆位关键词</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.keywords!.reversed.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-sm text-red-300"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword('reversed', index)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeywordReversed}
                  onChange={(e) => setNewKeywordReversed(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword('reversed'))}
                  placeholder="输入新关键词"
                  className="flex-1 px-3 py-2 bg-purple-950/50 border border-purple-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50"
                />
                <button
                  onClick={() => addKeyword('reversed')}
                  className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* 牌意编辑 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-amber-500 rounded-full" />
              牌意内容
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-green-400 mb-2">正位牌意</label>
                <textarea
                  value={formData.meaning!.upright}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    meaning: { ...prev.meaning!, upright: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-purple-900/50 border border-green-500/20 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-green-500/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-red-400 mb-2">逆位牌意</label>
                <textarea
                  value={formData.meaning!.reversed}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    meaning: { ...prev.meaning!, reversed: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-purple-900/50 border border-red-500/20 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-red-500/50 resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* 底部操作区 */}
        <div className="flex items-center justify-between p-6 border-t border-purple-500/20 bg-purple-950/50">
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-green-400 text-sm flex items-center gap-1 animate-fade-in-up">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                已保存
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重置默认
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-amber-500 text-white rounded-xl hover:from-purple-700 hover:to-amber-600 transition-all"
            >
              <Save className="w-4 h-4" />
              保存修改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
