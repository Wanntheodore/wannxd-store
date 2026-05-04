import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Save, Eye, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { formatCurrency, DEFAULT_PROFIT_SETTINGS, calculateSellingPrice } from '@/utils/profitEngine';
import { PRODUCTS } from '@/data/products';
import { ProfitSettings } from '@/types';

const AdminProfit = () => {
  const { profitSettings, updateProfitSettings } = useStore();
  const [settings, setSettings] = useState<ProfitSettings>(profitSettings);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    updateProfitSettings(settings);
    alert('Pengaturan profit berhasil disimpan!');
  };

  const handleReset = () => {
    setSettings(DEFAULT_PROFIT_SETTINGS);
  };

  // Preview calculations
  const previewProducts = PRODUCTS.slice(0, 4).map(product => {
    const { sellingPrice, profit } = calculateSellingPrice(product, settings);
    return { ...product, sellingPrice, profit };
  });

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Profit Settings
            </h1>
            <p className="text-muted-foreground text-sm">Atur margin keuntungan toko</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
          >
            <h2 className="font-bold text-lg mb-6">Konfigurasi Profit</h2>

            {/* Global Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg mb-6">
              <div>
                <p className="font-semibold">Mode Global</p>
                <p className="text-sm text-muted-foreground">Terapkan profit yang sama untuk semua produk</p>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, globalEnabled: !s.globalEnabled }))}
                className={`w-14 h-7 rounded-full transition-all duration-300 ${
                  settings.globalEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  settings.globalEnabled ? 'translate-x-8' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {settings.globalEnabled ? (
              /* Global Settings */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Tipe Profit Global</label>
                  <select
                    value={settings.globalType}
                    onChange={(e) => setSettings(s => ({ ...s, globalType: e.target.value as 'fixed' | 'percentage' }))}
                    className="input-neon w-full"
                  >
                    <option value="fixed">Nominal (IDR)</option>
                    <option value="percentage">Persentase (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Nilai {settings.globalType === 'fixed' ? '(IDR)' : '(%)'}
                  </label>
                  <input
                    type="number"
                    value={settings.globalValue}
                    onChange={(e) => setSettings(s => ({ ...s, globalValue: Number(e.target.value) }))}
                    className="input-neon w-full"
                  />
                </div>
              </div>
            ) : (
              /* Per-Category Settings */
              <div className="space-y-6">
                {/* Premium Category */}
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="text-xl">👑</span> Premium Account
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Tipe</label>
                      <select
                        value={settings.premiumType}
                        onChange={(e) => setSettings(s => ({ ...s, premiumType: e.target.value as 'fixed' | 'percentage' }))}
                        className="input-neon w-full text-sm py-2"
                      >
                        <option value="fixed">Nominal</option>
                        <option value="percentage">Persen</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Nilai</label>
                      <input
                        type="number"
                        value={settings.premiumValue}
                        onChange={(e) => setSettings(s => ({ ...s, premiumValue: Number(e.target.value) }))}
                        className="input-neon w-full text-sm py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* NOKOS Category */}
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="text-xl">🌍</span> NOKOS
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Tipe</label>
                      <select
                        value={settings.nokosType}
                        onChange={(e) => setSettings(s => ({ ...s, nokosType: e.target.value as 'fixed' | 'percentage' }))}
                        className="input-neon w-full text-sm py-2"
                      >
                        <option value="fixed">Nominal</option>
                        <option value="percentage">Persen</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Nilai</label>
                      <input
                        type="number"
                        value={settings.nokosValue}
                        onChange={(e) => setSettings(s => ({ ...s, nokosValue: Number(e.target.value) }))}
                        className="input-neon w-full text-sm py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <h3 className="font-semibold mb-4">Pengaturan Lanjutan</h3>
              
              {/* Auto Round */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Auto Round</p>
                  <p className="text-xs text-muted-foreground">Bulatkan harga ke atas</p>
                </div>
                <button
                  onClick={() => setSettings(s => ({ ...s, autoRound: !s.autoRound }))}
                  className={`w-14 h-7 rounded-full transition-all duration-300 ${
                    settings.autoRound ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                    settings.autoRound ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {settings.autoRound && (
                <div className="mb-4">
                  <label className="block text-sm text-muted-foreground mb-2">Kelipatan Pembulatan</label>
                  <input
                    type="number"
                    value={settings.roundTo}
                    onChange={(e) => setSettings(s => ({ ...s, roundTo: Number(e.target.value) }))}
                    className="input-neon w-full"
                    placeholder="500"
                  />
                </div>
              )}

              {/* Min/Max Profit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Min Profit</label>
                  <input
                    type="number"
                    value={settings.minProfit}
                    onChange={(e) => setSettings(s => ({ ...s, minProfit: Number(e.target.value) }))}
                    className="input-neon w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Max Profit</label>
                  <input
                    type="number"
                    value={settings.maxProfit}
                    onChange={(e) => setSettings(s => ({ ...s, maxProfit: Number(e.target.value) }))}
                    className="input-neon w-full"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button onClick={handleReset} className="btn-glass flex-1 flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button onClick={handleSave} className="btn-neon flex-1 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Simpan
              </button>
            </div>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Preview Harga
              </h2>
            </div>

            <div className="space-y-4">
              {previewProducts.map(product => (
                <div key={product.id} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{product.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{product.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        product.category === 'premium' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                      }`}>
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Modal</p>
                      <p className="font-medium">{formatCurrency(product.basePrice)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Profit</p>
                      <p className="font-medium text-green-400">+{formatCurrency(product.profit)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Harga Jual</p>
                      <p className="font-bold gradient-text">{formatCurrency(product.sellingPrice)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Formula */}
            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium mb-2">📐 Rumus Harga:</p>
              <code className="text-xs text-primary">
                {settings.globalEnabled 
                  ? `Harga Jual = Modal + ${settings.globalType === 'fixed' ? formatCurrency(settings.globalValue) : `(Modal × ${settings.globalValue}%)`}`
                  : 'Harga Jual = Modal + Profit Kategori'
                }
              </code>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfit;
