import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Music, 
  Hash, 
  ShoppingBag, 
  Flame, 
  ArrowUpRight,
  Filter,
  Search,
  ExternalLink,
  Copy,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trendingApi } from '@/services/mockApi';
import type { TrendingItem } from '@/types';

const categories = [
  { id: 'all', label: 'All', icon: TrendingUp },
  { id: 'sounds', label: 'Viral Sounds', icon: Music },
  { id: 'hashtags', label: 'Hashtags', icon: Hash },
  { id: 'products', label: 'Hot Products', icon: ShoppingBag },
];

const platforms = ['All Platforms', 'TikTok', 'Instagram', 'YouTube', 'Shopee'];

export default function Trending() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePlatform, setActivePlatform] = useState('All Platforms');
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedItems, setSavedItems] = useState<string[]>([]);

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    setIsLoading(true);
    try {
      const items = await trendingApi.getTrending();
      setTrendingItems(items);
    } catch (error) {
      toast.error('Failed to load trending items');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = trendingItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
    const matchesPlatform = activePlatform === 'All Platforms' || item.platform === activePlatform;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPlatform && matchesSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleSave = (id: string) => {
    setSavedItems(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
    toast.success(savedItems.includes(id) ? 'Removed from saved' : 'Saved for later');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sound': return Music;
      case 'hashtag': return Hash;
      case 'product': return ShoppingBag;
      default: return TrendingUp;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sound': return 'bg-pink-500/20 text-pink-400';
      case 'hashtag': return 'bg-cyan-500/20 text-cyan-400';
      case 'product': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-purple-500/20 text-purple-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Trending Research
          </h1>
          <p className="text-white/60 mt-1">
            Discover what's viral right now
          </p>
        </div>
        <Button 
          onClick={loadTrending}
          className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-purple to-cyan text-white'
                : 'glass text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trending items..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-white/40" />
          <select
            value={activePlatform}
            onChange={(e) => setActivePlatform(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple/50"
          >
            {platforms.map((p) => (
              <option key={p} value={p} className="bg-surface">{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Viral Sounds', value: '1,234', change: '+23%', icon: Music },
          { label: 'Trending Tags', value: '5,678', change: '+15%', icon: Hash },
          { label: 'Hot Products', value: '892', change: '+31%', icon: ShoppingBag },
          { label: 'Total Trends', value: '7,804', change: '+18%', icon: Flame },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-cyan" />
              <span className="text-sm text-white/50">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-success">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Trending List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl">
          <TrendingUp className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No items found</h3>
          <p className="text-white/50">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const Icon = getTypeIcon(item.type);
            return (
              <div
                key={item.id}
                className="glass rounded-xl p-4 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(item.type)}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{item.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                        {item.platform}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white/50">Popularity: {item.popularity}/100</span>
                      <span className="text-success flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        {item.growth}
                      </span>
                      {item.category && (
                        <span className="text-white/40">{item.category}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(item.name)}
                      className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleSave(item.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        savedItems.includes(item.id)
                          ? 'bg-purple/20 text-purple'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Top Trending Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Sounds */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-pink-400" />
            Top Viral Sounds
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Original Sound - @creatorname', uses: '2.3M', trend: '+245%' },
              { name: 'Trending Audio 2026', uses: '1.8M', trend: '+189%' },
              { name: 'Viral Beat Drop', uses: '1.2M', trend: '+156%' },
              { name: 'Popular Remix', uses: '980K', trend: '+134%' },
              { name: 'Indie Viral Track', uses: '750K', trend: '+98%' },
            ].map((sound, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-white text-sm">{sound.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white/60 text-xs">{sound.uses} uses</div>
                  <div className="text-success text-xs">{sound.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Hashtags */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-cyan-400" />
            Trending Hashtags
          </h3>
          <div className="space-y-3">
            {[
              { tag: '#TikTokMadeMeBuyIt', posts: '45.2M', trend: '+23%' },
              { tag: '#AffiliateMarketing', posts: '12.8M', trend: '+18%' },
              { tag: '#ProductReview', posts: '8.5M', trend: '+15%' },
              { tag: '#ShopeeHaul', posts: '6.2M', trend: '+31%' },
              { tag: '#ViralProducts', posts: '4.1M', trend: '+12%' },
            ].map((hashtag, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-white text-sm">{hashtag.tag}</span>
                </div>
                <div className="text-right">
                  <div className="text-white/60 text-xs">{hashtag.posts} posts</div>
                  <div className="text-success text-xs">{hashtag.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
