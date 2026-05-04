import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, CheckCircle, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { getProductById } from '@/data/products';
import { formatCurrency } from '@/utils/profitEngine';
import { Transaction } from '@/types';

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getSellingPrice, addTransaction, apiConfig } = useStore();
  
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const product = productId ? getProductById(productId) : undefined;
  
  if (!product) {
    return (
      <div className="min-h-screen pt-28 pb-12 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Produk tidak ditemukan</p>
          <button onClick={() => navigate('/products')} className="btn-neon mt-4">
            Kembali ke Store
          </button>
        </div>
      </div>
    );
  }

  const { sellingPrice, profit } = getSellingPrice(product);
  const hasPakasir = apiConfig.pakasirSlug && apiConfig.pakasirApiKey;

  const handlePayment = async () => {
    if (!email) {
      setError('Masukkan email untuk pengiriman');
      return;
    }

    if (!hasPakasir) {
      setError('Payment gateway belum dikonfigurasi. Hubungi admin.');
      return;
    }

    setError('');
    setIsProcessing(true);

    const orderId = `ORD-${Date.now()}`;

    // Record transaction as pending
    const transaction: Transaction = {
      id: `TRX-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      category: product.category,
      basePrice: product.basePrice,
      sellingPrice,
      profit,
      paymentMethod: 'pakasir',
      status: 'pending',
      createdAt: new Date(),
      customerEmail: email,
      orderId,
    };

    addTransaction(transaction);

    // Redirect to Pakasir payment page
    const pakasirUrl = `https://app.pakasir.com/pay/${apiConfig.pakasirSlug}/${sellingPrice}?order_id=${orderId}&redirect=${encodeURIComponent(window.location.origin + '/products')}`;
    
    setIsProcessing(false);
    window.open(pakasirUrl, '_blank');
  };

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8"
        >
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-primary" />
            Checkout
          </h1>

          {/* Product Summary */}
          <div className="glass-card p-4 mb-6 bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-primary/50 flex items-center justify-center text-2xl">
                {product.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                {product.duration && (
                  <p className="text-xs text-primary mt-1">{product.duration}</p>
                )}
              </div>
              <p className="text-xl font-bold gradient-text">{formatCurrency(sellingPrice)}</p>
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm text-muted-foreground mb-2">Email Pengiriman</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="input-neon w-full"
            />
          </div>

          {/* Payment Info */}
          <div className="mb-6 p-4 bg-muted/20 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💳</span>
              <span className="font-semibold">Pembayaran via Pakasir</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Kamu akan diarahkan ke halaman pembayaran Pakasir untuk menyelesaikan transaksi via QRIS, Virtual Account, atau metode lainnya.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg mb-6"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || !hasPakasir}
            className="btn-neon w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <ExternalLink className="w-5 h-5" />
                Bayar {formatCurrency(sellingPrice)}
              </>
            )}
          </button>

          {!hasPakasir && (
            <p className="text-xs text-center text-yellow-400 mt-3">
              ⚠️ Payment gateway belum dikonfigurasi oleh admin
            </p>
          )}

          {/* Security Notice */}
          <p className="text-xs text-center text-muted-foreground mt-4">
            🔒 Transaksi aman melalui Pakasir Payment Gateway
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
