import { useState, useEffect } from 'react';
import {
  Store,
  Search,
  Filter,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { marketplaceApi } from '@/services/mockApi';
import type { MarketplaceBrand } from '@/types';

const categories = [
  { id: 'all', label: 'All Brands' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'tech', label: 'Tech' },
  { id: 'food', label: 'Food' },
  { id: 'home', label: 'Home' },
];

export default function Marketplace() {
  const [brands, setBrands] = useState<MarketplaceBrand[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedBrands, setSavedBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<MarketplaceBrand | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await marketplaceApi.getBrands();
        setBrands(data);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter(brand => {
    const matchesCategory = activeCategory === 'all' || brand.category === activeCategory;
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleSave = (id: string) => {
    setSavedBrands(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
    toast.success(savedBrands.includes(id) ? 'Removed from saved' : 'Saved for later');
  };

  const handleApply = (brand: typeof brands[0]) => {
    toast.success(`Application sent to ${brand.name}!`);
    setSelectedBrand(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beauty': return 'bg-pink-500/20 text-pink-400';
      case 'fashion': return 'bg-purple-500/20 text-purple-400';
      case 'tech': return 'bg-cyan-500/20 text-cyan-400';
      case 'food': return 'bg-orange-500/20 text-orange-400';
      case 'home': return 'bg-green-500/20 text-green-400';
      default: return 'bg-white/10 text-white/60';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Affiliate Marketplace
          </h1>
          <p className="text-white/60 mt-1">
            Discover brands and start earning commissions
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Store className="w-4 h-4 text-cyan" />
          <span>{brands.length} brands available</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="glass rounded-xl p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Brands', value: '45+', icon: Store },
            { label: 'Active Creators', value: '12.5K', icon: Users },
            { label: 'Avg Commission', value: '12%', icon: DollarSign },
            { label: 'Total Earned', value: 'Rp 2.8M', icon: TrendingUp },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-1">
                <stat.icon className="w-5 h-5 text-cyan" />
              </div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brands..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-white/40" />
          <select className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple/50">
            <option className="bg-surface">Highest Commission</option>
            <option className="bg-surface">Most Popular</option>
            <option className="bg-surface">Best Conversion</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl transition-all ${activeCategory === cat.id
              ? 'bg-gradient-to-r from-purple to-cyan text-white'
              : 'glass text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Brands Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            className="glass rounded-xl overflow-hidden hover:bg-white/5 transition-all group"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{brand.name}</h3>
                      {brand.isVerified && (
                        <CheckCircle className="w-4 h-4 text-cyan" />
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(brand.category)}`}>
                      {brand.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleSave(brand.id)}
                  className={`p-2 rounded-lg transition-colors ${savedBrands.includes(brand.id)
                    ? 'bg-pink-500/20 text-pink-400'
                    : 'bg-white/5 text-white/40 hover:text-white'
                    }`}
                >
                  <Bookmark className={`w-4 h-4 ${savedBrands.includes(brand.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-white/60 mb-4 line-clamp-2">
                {brand.description}
              </p>

              {/* Commission Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple/20 to-cyan/20">
                  <span className="text-sm font-semibold text-white">{brand.commission} Commission</span>
                </div>
                {brand.isPopular && (
                  <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs">
                    Popular
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-sm font-semibold text-white">{brand.avgOrder}</div>
                  <div className="text-xs text-white/40">Avg Order</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-sm font-semibold text-cyan">{brand.conversionRate}</div>
                  <div className="text-xs text-white/40">Conversion</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-sm font-semibold text-white flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {brand.rating}
                  </div>
                  <div className="text-xs text-white/40">Rating</div>
                </div>
              </div>

              {/* Products */}
              <div className="flex flex-wrap gap-1 mb-4">
                {brand.products.slice(0, 3).map((product, i) => (
                  <span key={i} className="px-2 py-1 rounded-full bg-white/5 text-white/50 text-xs">
                    {product}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedBrand(brand)}
                  className="flex-1 bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
                >
                  View Details
                </Button>
                <button className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Brand Detail Modal */}
      {selectedBrand && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedBrand(null)}
          />
          <div className="relative w-full max-w-2xl glass rounded-2xl p-6 animate-in fade-in zoom-in max-h-[90vh] overflow-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {selectedBrand.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-bold text-white">{selectedBrand.name}</h3>
                    {selectedBrand.isVerified && (
                      <CheckCircle className="w-5 h-5 text-cyan" />
                    )}
                  </div>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${getCategoryColor(selectedBrand.category)}`}>
                    {selectedBrand.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBrand(null)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-white/70 mb-6">{selectedBrand.description}</p>

            {/* Commission Highlight */}
            <div className="glass rounded-xl p-6 mb-6 bg-gradient-to-r from-purple/20 to-cyan/20 border border-purple/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Commission Rate</p>
                  <p className="text-3xl font-bold text-white">{selectedBrand.commission}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">Per Sale</p>
                  <p className="text-white">Avg {selectedBrand.avgOrder}</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-cyan">{selectedBrand.conversionRate}</div>
                <div className="text-xs text-white/40">Conversion</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-white flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {selectedBrand.rating}
                </div>
                <div className="text-xs text-white/40">Rating</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-white">{selectedBrand.campaigns}</div>
                <div className="text-xs text-white/40">Campaigns</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-white">{selectedBrand.creators}</div>
                <div className="text-xs text-white/40">Creators</div>
              </div>
            </div>

            {/* Products */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">Featured Products</h4>
              <div className="flex flex-wrap gap-2">
                {selectedBrand.products.map((product, i) => (
                  <span key={i} className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm">
                    {product}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleApply(selectedBrand)}
                className="flex-1 bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white py-6"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Apply to Partner
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setSelectedBrand(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
