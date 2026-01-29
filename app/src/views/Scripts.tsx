import { useState } from 'react';
import { FileText, Search, Trash2, Copy, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScripts } from '@/hooks/useScripts';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';

const frameworks = ['AIDA', 'PAS', 'BAB', 'PASTOR'];
const platforms = ['tiktok', 'shopee', 'instagram', 'youtube'];
const tones = ['casual', 'professional', 'energetic', 'empathetic'];

export default function Scripts() {
  const { scripts, generateScript, regenerateModule, deleteScript, isLoading } = useScripts();
  const { products } = useProducts();
  const [showGenerator, setShowGenerator] = useState(false);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Generator form state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('AIDA');
  const [selectedPlatform, setSelectedPlatform] = useState('tiktok');
  const [selectedTone, setSelectedTone] = useState('casual');

  const filteredScripts = scripts.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerate = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }
    
    try {
      await generateScript(selectedProduct, selectedFramework, selectedPlatform, selectedTone);
      toast.success('Script generated successfully!');
      setShowGenerator(false);
    } catch (error) {
      toast.error('Failed to generate script');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleRegenerate = async (scriptId: string, moduleId: string) => {
    try {
      await regenerateModule(scriptId, moduleId);
      toast.success('Module regenerated');
    } catch (error) {
      toast.error('Failed to regenerate');
    }
  };

  const toggleExpand = (scriptId: string) => {
    setExpandedScript(expandedScript === scriptId ? null : scriptId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Scripts
          </h1>
          <p className="text-white/60 mt-1">
            Manage your AI-generated scripts
          </p>
        </div>
        <Button 
          onClick={() => setShowGenerator(!showGenerator)}
          className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
        >
          <FileText className="w-4 h-4 mr-2" />
          {showGenerator ? 'Cancel' : 'New Script'}
        </Button>
      </div>

      {/* Script Generator */}
      {showGenerator && (
        <div className="glass rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold text-white mb-4">
            Generate New Script
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple/50"
              >
                <option value="" className="bg-surface">Select product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} className="bg-surface">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Framework</label>
              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple/50"
              >
                {frameworks.map((f) => (
                  <option key={f} value={f} className="bg-surface">{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple/50"
              >
                {platforms.map((p) => (
                  <option key={p} value={p} className="bg-surface capitalize">{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Tone</label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple/50"
              >
                {tones.map((t) => (
                  <option key={t} value={t} className="bg-surface capitalize">{t}</option>
                ))}
              </select>
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !selectedProduct}
            className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            Generate Script
          </Button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search scripts..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple/50"
        />
      </div>

      {/* Scripts List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredScripts.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No scripts yet</h3>
          <p className="text-white/50 mb-4">Generate your first script to get started</p>
          <Button 
            onClick={() => setShowGenerator(true)}
            className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            New Script
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredScripts.map((script) => (
            <div
              key={script.id}
              className="glass rounded-xl overflow-hidden"
            >
              {/* Script Header */}
              <button
                onClick={() => toggleExpand(script.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white">{script.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <span className="capitalize">{script.platform}</span>
                      <span>•</span>
                      <span>{script.framework}</span>
                      <span>•</span>
                      <span>{script.totalDuration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-white/50">Score</div>
                    <div className="font-semibold text-cyan">{script.score}/10</div>
                  </div>
                  {expandedScript === script.id ? (
                    <ChevronUp className="w-5 h-5 text-white/60" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/60" />
                  )}
                </div>
              </button>

              {/* Script Content */}
              {expandedScript === script.id && (
                <div className="border-t border-white/10 p-4">
                  <div className="space-y-3">
                    {script.modules.map((module) => (
                      <div
                        key={module.id}
                        className="p-3 rounded-lg bg-white/5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              module.type === 'hook' ? 'bg-purple/20 text-purple' :
                              module.type === 'cta' ? 'bg-cyan/20 text-cyan' :
                              'bg-white/10 text-white/60'
                            }`}>
                              {module.type.toUpperCase()}
                            </span>
                            <span className="text-xs text-white/40">{module.duration}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleCopy(module.content)}
                              className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRegenerate(script.id, module.id)}
                              className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-cyan transition-colors"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-white/80">{module.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
                    >
                      Generate Video
                    </Button>
                    <button
                      onClick={() => handleCopy(script.modules.map(m => m.content).join('\n\n'))}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
                    >
                      Copy All
                    </button>
                    <button
                      onClick={() => deleteScript(script.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:text-red-400 hover:bg-white/10 transition-colors text-sm ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
