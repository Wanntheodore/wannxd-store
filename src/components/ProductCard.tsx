import { motion } from 'framer-motion';
import { Clock, CheckCircle, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { formatCurrency } from '@/utils/profitEngine';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const { getSellingPrice, stockMap, apiConfig } = useStore();
  
  const { sellingPrice } = getSellingPrice(product);
  const stock = stockMap[product.id] ?? product.stock;
  const isAvailable = stock > 0;
  const hasPakasir = !!(apiConfig.pakasirSlug && apiConfig.pakasirApiKey);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-6 hover:neon-border transition-all duration-300 group"
    >
      {/* Header with Circular Logo */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-primary/50 flex items-center justify-center text-3xl shadow-lg shadow-primary/20">
          {product.icon}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            product.category === 'premium' 
              ? 'bg-primary/20 text-primary' 
              : 'bg-secondary/20 text-secondary'
          }`}>
            {product.category.toUpperCase()}
          </span>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className={`text-xs ${isAvailable ? 'status-online' : 'status-offline'}`}>
              {isAvailable ? 'READY' : 'EMPTY'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <h3 className="font-bold text-lg mb-2 text-foreground group-hover:gradient-text transition-all duration-300">
        {product.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {product.description}
      </p>

      {/* Features */}
      <div className="flex flex-wrap gap-1 mb-4">
        {product.features.slice(0, 3).map((feature, i) => (
          <span key={i} className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-md flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-400" />
            {feature}
          </span>
        ))}
      </div>

      {/* Duration */}
      {product.duration && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="w-4 h-4" />
          <span>{product.duration}</span>
        </div>
      )}

      {/* Price & Buy */}
      <div className="pt-4 border-t border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-extrabold gradient-text">
              {formatCurrency(sellingPrice)}
            </p>
            <p className="text-xs text-muted-foreground">
              Stok: {stock}
            </p>
          </div>
        </div>
        {isAvailable && hasPakasir && (
          <Link
            to={`/checkout/${product.id}`}
            className="btn-neon w-full flex items-center justify-center gap-2 text-sm py-2.5"
          >
            <ShoppingCart className="w-4 h-4" />
            BELI SEKARANG
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
