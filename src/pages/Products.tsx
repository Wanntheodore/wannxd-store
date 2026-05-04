import { motion } from 'framer-motion';
import { Package, RefreshCw } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';

const Products = () => {
  const { products, isSyncing, syncStock, lastSync, apiConfig } = useStore();

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Katalog Produk</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Pilih akun premium atau layanan NOKOS yang kamu butuhkan
          </p>
        </motion.div>

        {/* Sync Status */}
        {(apiConfig.premiumApiKey || apiConfig.nokosApiKey) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <button
              onClick={syncStock}
              disabled={isSyncing}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Stock'}
            </button>
            {lastSync && (
              <span className="text-xs text-muted-foreground">
                Last sync: {lastSync.toLocaleTimeString()}
              </span>
            )}
          </motion.div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Tidak ada produk ditemukan</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;
