import { useState } from 'react';
import { Link2, Loader2, Check, ExternalLink, Star, TrendingUp, Sparkles, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { useProducts } from '@/hooks/useProducts';

export default function ProductExtractor() {
  const [url, setUrl] = useState('');
  const [extractedProduct, setExtractedProduct] = useState<Product | null>(null);
  const { extractProduct, isLoading, deleteProduct } = useProducts();

  const handleExtract = async () => {
    if (!url.trim()) {
      toast.error('Please enter a product URL');
      return;
    }

    try {
      const product = await extractProduct(url);
      setExtractedProduct(product);
      toast.success('Product extracted successfully!', {
        description: `${product.name} - ${product.platform}`,
      });
      setUrl('');
    } catch (error) {
      toast.error('Failed to extract product');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setExtractedProduct(null);
    toast.success('Product deleted');
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'shopee': return 'text-orange-400';
      case 'tokopedia': return 'text-green-400';
      case 'tiktok': return 'text-pink-400';
      case 'lazada': return 'text-orange-500';
      default: return 'text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold text-white mb-4">
          Extract Product Data
        </h3>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Shopee, Tokopedia, or TikTok Shop link..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple/50"
            />
          </div>
          <Button
            onClick={handleExtract}
            disabled={isLoading}
            className="px-6 py-4 bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white font-semibold"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Extract
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-white/40 mt-3">
          Supported: Shopee, Tokopedia, TikTok Shop, Lazada
        </p>
      </div>

      {/* Extracted Product */}
      {extractedProduct && (
        <div className="glass rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-medium ${getPlatformColor(extractedProduct.platform)}`}>
                  {extractedProduct.platform.toUpperCase()}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-sm text-white/50">{extractedProduct.category}</span>
              </div>
              <h4 className="font-display text-xl font-semibold text-white">
                {extractedProduct.name}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(extractedProduct.productUrl)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(extractedProduct.id)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Image & Price */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl bg-white/5 overflow-hidden">
                <img
                  src={extractedProduct.images[0]}
                  alt={extractedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-white">
                  Rp {extractedProduct.price.toLocaleString('id-ID')}
                </span>
                {extractedProduct.originalPrice && (
                  <span className="text-lg text-white/40 line-through">
                    Rp {extractedProduct.originalPrice.toLocaleString('id-ID')}
                  </span>
                )}
                {extractedProduct.discount && (
                  <span className="px-2 py-1 rounded-lg bg-success/20 text-success text-sm">
                    -{extractedProduct.discount}%
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white">{extractedProduct.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-cyan" />
                  <span className="text-white/70">{extractedProduct.soldCount} sold</span>
                </div>
              </div>
            </div>

            {/* Right: Analysis */}
            <div className="space-y-4">
              {/* Viral Score */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple/20 to-cyan/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Viral Score</span>
                  <span className="text-2xl font-bold text-white">{extractedProduct.viralScore}/10</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple to-cyan"
                    style={{ width: `${extractedProduct.viralScore * 10}%` }}
                  />
                </div>
              </div>

              {/* USP */}
              <div>
                <h5 className="text-sm text-white/70 mb-2">Unique Selling Points</h5>
                <div className="space-y-2">
                  {extractedProduct.usp.map((usp, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/80">{usp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Angles */}
              <div>
                <h5 className="text-sm text-white/70 mb-2">Suggested Content Angles</h5>
                <div className="flex flex-wrap gap-2">
                  {extractedProduct.contentAngles.map((angle, i) => (
                    <button
                      key={i}
                      onClick={() => handleCopy(angle)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors text-left"
                    >
                      {angle}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h5 className="text-sm text-white/70 mb-2">Key Features</h5>
                <div className="flex flex-wrap gap-2">
                  {extractedProduct.keyFeatures.map((feature, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-lg bg-white/5 text-xs text-white/60"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
            <Button
              className="flex-1 bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Script
            </Button>
            <a
              href={extractedProduct.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Product
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
