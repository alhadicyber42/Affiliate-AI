import { useState } from 'react';
import { Package, Search, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductExtractor from '@/components/ProductExtractor';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';

export default function Products() {
  const [showExtractor, setShowExtractor] = useState(false);
  const { products, deleteProduct, isLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success('Product deleted');
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'shopee': return 'bg-orange-500/20 text-orange-400';
      case 'tokopedia': return 'bg-green-500/20 text-green-400';
      case 'tiktok': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-white/10 text-white/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Products
          </h1>
          <p className="text-white/60 mt-1">
            Manage your extracted products
          </p>
        </div>
        <Button 
          onClick={() => setShowExtractor(!showExtractor)}
          className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {showExtractor ? 'Hide Extractor' : 'Extract Product'}
        </Button>
      </div>

      {/* Product Extractor */}
      {showExtractor && <ProductExtractor />}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple/50"
        />
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl">
          <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No products yet</h3>
          <p className="text-white/50 mb-4">Extract your first product to get started</p>
          <Button 
            onClick={() => setShowExtractor(true)}
            className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Extract Product
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass rounded-xl overflow-hidden hover:bg-white/5 transition-colors group"
            >
              {/* Image */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${getPlatformColor(product.platform)}`}>
                  {product.platform.toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-white/50 mb-3">{product.category}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-white">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.discount && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-success/20 text-success">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-white/60">
                    ★ {product.rating}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Script
                  </Button>
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-red-400 hover:bg-white/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
