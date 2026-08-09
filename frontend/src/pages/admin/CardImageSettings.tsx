import { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Search,
  Filter,
  X,
  Check,
  Eye,
  Edit3,
  FileText
} from 'lucide-react';
import { allCards, suitLabels } from '../../data';
import { useAdminConfigStore } from '../../store/adminConfig';
import CardMeaningEditor from '../../components/admin/CardMeaningEditor';

type FilterType = 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'major', label: '大阿卡纳' },
  { value: 'wands', label: '权杖' },
  { value: 'cups', label: '圣杯' },
  { value: 'swords', label: '宝剑' },
  { value: 'pentacles', label: '星币' },
];

export default function CardImageSettings() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewCard, setPreviewCard] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  
  const config = useAdminConfigStore((state) => state.config);
  const setCardImage = useAdminConfigStore((state) => state.setCardImage);
  const removeCardImage = useAdminConfigStore((state) => state.removeCardImage);

  // 筛选卡片
  const filteredCards = allCards.filter((card) => {
    // 过滤器
    if (filter === 'major' && card.arcana !== 'major') return false;
    if (filter !== 'all' && filter !== 'major' && card.suit !== filter) return false;
    
    // 搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        card.name.toLowerCase().includes(query) ||
        card.englishName.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleImageUpload = (cardId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setCardImage(cardId, result);
    };
    reader.readAsDataURL(file);
  };

  const getSuitLabel = (suit?: string) => {
    if (!suit) return '';
    const key = suit as keyof typeof suitLabels;
    return suitLabels[key]?.cn || suit;
  };

  const majorArcanaLabels: Record<number, string> = {
    0: '愚者', 1: '魔术师', 2: '女祭司', 3: '皇后', 4: '皇帝',
    5: '教皇', 6: '恋人', 7: '战车', 8: '力量', 9: '隐士',
    10: '命运之轮', 11: '正义', 12: '倒吊人', 13: '死神', 14: '节制',
    15: '恶魔', 16: '塔', 17: '星星', 18: '月亮', 19: '太阳',
    20: '审判', 21: '世界',
  };

  const getArcanaLabel = (card: typeof allCards[0]) => {
    if (card.arcana === 'major') {
      return majorArcanaLabels[card.number] || card.name;
    }
    return `${getSuitLabel(card.suit)} ${card.number}`;
  };

  const uploadedCount = Object.keys(config.cardImages).length;
  const meaningCount = Object.keys(config.cardMeanings).length;
  const totalCount = allCards.length;

  return (
    <div className="space-y-6">
      {/* 页面标题和统计 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-400" />
            牌面管理
          </h1>
          <p className="text-purple-300/70 mt-1">上传图片和编辑牌意信息</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <span className="text-amber-400 font-bold text-xl">{uploadedCount}</span>
            <span className="text-purple-300/60 text-sm"> / {totalCount} 张图片</span>
          </div>
          <div className="px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <span className="text-green-400 font-bold text-xl">{meaningCount}</span>
            <span className="text-purple-300/60 text-sm"> / {totalCount} 张牌意</span>
          </div>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="glass-card rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 搜索 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索牌名..."
              className="w-full pl-10 pr-4 py-2 bg-purple-950/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* 筛选器 */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-3 py-2 bg-purple-950/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 进度条 */}
        <div className="h-2 bg-purple-500/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-500"
            style={{ width: `${(uploadedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* 牌面网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredCards.map((card) => {
          const hasImage = !!config.cardImages[card.id];
          const imageUrl = config.cardImages[card.id];
          const hasMeaning = !!config.cardMeanings[card.id];
          const customMeaning = config.cardMeanings[card.id];
          const displayName = customMeaning?.name || card.name;

          return (
            <div
              key={card.id}
              className={`relative group rounded-xl overflow-hidden border transition-all ${
                hasImage || hasMeaning
                  ? 'border-amber-500/30'
                  : 'border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              {/* 牌面图或占位 */}
              <div className="aspect-[2/3] bg-gradient-to-br from-purple-900/50 to-purple-950/50 relative">
                {hasImage ? (
                  <img
                    src={imageUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-2">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-dashed border-purple-500/40 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-purple-500/40" />
                      </div>
                      <p className="text-xs text-purple-400/60">未上传</p>
                    </div>
                  </div>
                )}

                {/* 悬浮操作 - 使用更高的z-index */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                  <label className="p-2 bg-amber-500 rounded-full cursor-pointer hover:bg-amber-600 transition-colors" title="上传图片">
                    <Upload className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(card.id, file);
                      }}
                    />
                  </label>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingCard(card.id); }}
                    className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                    title="编辑牌意"
                  >
                    <Edit3 className="w-4 h-4 text-white" />
                  </button>
                  {hasImage && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewCard(card.id); }}
                        className="p-2 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors"
                        title="预览"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeCardImage(card.id); }}
                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                        title="删除图片"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </>
                  )}
                </div>

                {/* 状态标记 */}
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  {hasImage && (
                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center" title="已上传图片">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {hasMeaning && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center" title="已编辑牌意">
                      <FileText className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* 牌名和操作 */}
              <div className="p-2 bg-purple-950/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-purple-300/60 truncate">
                      {getArcanaLabel(card)}
                    </p>
                    {hasMeaning && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {customMeaning?.keywords?.upright?.slice(0, 2).map((kw, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-300 rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingCard(card.id); }}
                    className="flex-shrink-0 p-1.5 text-purple-400 hover:text-green-400 hover:bg-green-500/20 rounded transition-colors"
                    title="编辑牌意"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12 text-purple-400/60">
          没有找到匹配的牌
        </div>
      )}

      {/* 预览模态框 */}
      {previewCard && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewCard(null)}
        >
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setPreviewCard(null)}
              className="absolute -top-10 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <img
              src={config.cardImages[previewCard]}
              alt="预览"
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="mt-4 text-center">
              <p className="text-white text-lg">
                {config.cardMeanings[previewCard]?.name || allCards.find(c => c.id === previewCard)?.name}
              </p>
              <p className="text-purple-300/60">
                {config.cardMeanings[previewCard]?.englishName || allCards.find(c => c.id === previewCard)?.englishName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 牌意编辑模态框 */}
      {editingCard && (
        <CardMeaningEditor
          card={allCards.find(c => c.id === editingCard)!}
          isOpen={!!editingCard}
          onClose={() => setEditingCard(null)}
        />
      )}
    </div>
  );
}
