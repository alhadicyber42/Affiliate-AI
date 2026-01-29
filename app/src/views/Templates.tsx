import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Star,
  Copy,
  Check,
  Sparkles,
  Heart,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { templateApi } from '@/services/mockApi';
import type { Template } from '@/types';

const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'beauty', label: 'Beauty & Skincare' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'tech', label: 'Tech & Gadgets' },
  { id: 'food', label: 'Food & Snacks' },
  { id: 'home', label: 'Home & Living' },
];

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await templateApi.getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
    toast.success(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleUseTemplate = (template: typeof templates[0]) => {
    toast.success(`Using template: ${template.name}`);
    setSelectedTemplate(null);
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
            Template Library
          </h1>
          <p className="text-white/60 mt-1">
            Choose from proven templates for your niche
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Sparkles className="w-4 h-4 text-cyan" />
          <span>{templates.length} templates available</span>
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
            placeholder="Search templates..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-white/40" />
          <select className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple/50">
            <option className="bg-surface">Most Popular</option>
            <option className="bg-surface">Newest</option>
            <option className="bg-surface">Highest Rated</option>
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

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="glass rounded-xl overflow-hidden hover:bg-white/5 transition-all group"
          >
            {/* Preview Area */}
            <div className="relative p-6 bg-gradient-to-br from-purple/10 to-cyan/10">
              {template.isNew && (
                <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
                  New
                </span>
              )}
              <button
                onClick={() => toggleFavorite(template.id)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${favorites.includes(template.id)
                  ? 'bg-pink-500/20 text-pink-400'
                  : 'bg-white/10 text-white/40 hover:text-white'
                  }`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(template.id) ? 'fill-current' : ''}`} />
              </button>

              <div className="mt-8">
                <p className="text-white/80 text-sm line-clamp-2 italic">
                  "{template.preview}"
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white">{template.name}</h3>
              </div>

              <p className="text-sm text-white/50 mb-3 line-clamp-2">
                {template.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-lg text-xs ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
                <span className="px-2 py-1 rounded-lg bg-white/10 text-white/60 text-xs">
                  {template.framework}
                </span>
                <span className="px-2 py-1 rounded-lg bg-white/10 text-white/60 text-xs">
                  {template.platform}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-white/60">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {template.rating}
                  </span>
                  <span className="flex items-center gap-1 text-white/60">
                    <Eye className="w-4 h-4" />
                    {template.uses.toLocaleString()}
                  </span>
                </div>
                <span className="text-white/40 text-xs">
                  {template.platform}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedTemplate(template)}
                  className="flex-1 bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedTemplate(null)}
          />
          <div className="relative w-full max-w-2xl glass rounded-2xl p-6 animate-in fade-in zoom-in max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">{selectedTemplate.name}</h3>
                <p className="text-white/50 text-sm">{selectedTemplate.description}</p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            <div className="glass rounded-xl p-6 mb-6 bg-gradient-to-br from-purple/10 to-cyan/10">
              <p className="text-white text-lg leading-relaxed">
                "{selectedTemplate.preview}"
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass rounded-xl p-4">
                <span className="text-white/50 text-sm">Framework</span>
                <p className="text-white font-medium">{selectedTemplate.framework}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <span className="text-white/50 text-sm">Platform</span>
                <p className="text-white font-medium">{selectedTemplate.platform}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <span className="text-white/50 text-sm">Rating</span>
                <p className="text-white font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {selectedTemplate.rating}
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <span className="text-white/50 text-sm">Times Used</span>
                <p className="text-white font-medium">{selectedTemplate.uses.toLocaleString()}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedTemplate.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleUseTemplate(selectedTemplate)}
                className="flex-1 bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white py-6"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Use This Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
