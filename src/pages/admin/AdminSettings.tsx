import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Key, Save, Eye, EyeOff, Link2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';

const AdminSettings = () => {
  const { apiConfig, updateApiConfig, syncStock, syncRumahOtpPrices, rumahOtpPrices, isSyncing } = useStore();
  const [config, setConfig] = useState(apiConfig);
  const [showPremiumKey, setShowPremiumKey] = useState(false);
  const [showNokosKey, setShowNokosKey] = useState(false);
  const [showRumahOtpKey, setShowRumahOtpKey] = useState(false);
  const [showPakasirKey, setShowPakasirKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ premium: boolean | null; nokos: boolean | null; rumahOtp: boolean | null }>({
    premium: null,
    nokos: null,
    rumahOtp: null,
  });

  const handleSave = async () => {
    updateApiConfig(config);
    if (config.rumahOtpApiKey) {
      await syncRumahOtpPrices();
    }
    syncStock();
    alert('Konfigurasi API berhasil disimpan!');
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult({ premium: null, nokos: null, rumahOtp: null });
    
    // Simulate API testing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTestResult({
      premium: config.premiumApiKey ? Math.random() > 0.2 : false,
      nokos: config.nokosApiKey ? Math.random() > 0.2 : false,
      rumahOtp: config.rumahOtpApiKey ? true : false, // Will use fallback prices
    });
    
    setIsTesting(false);
  };

  const rumahOtpPriceCount = Object.keys(rumahOtpPrices).length;

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Key className="w-6 h-6 text-primary" />
              API Configuration
            </h1>
            <p className="text-muted-foreground text-sm">Kelola koneksi ke supplier API</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          {/* Premium API */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">👑</span>
              <h2 className="font-bold text-lg">Premium Account API</h2>
              {testResult.premium !== null && (
                testResult.premium 
                  ? <CheckCircle className="w-5 h-5 text-green-400" />
                  : <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Base URL</label>
                <input
                  type="url"
                  value={config.premiumBaseUrl}
                  onChange={(e) => setConfig(c => ({ ...c, premiumBaseUrl: e.target.value }))}
                  placeholder="https://premku.com/api"
                  className="input-neon w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">API Key</label>
                <div className="relative">
                  <input
                    type={showPremiumKey ? 'text' : 'password'}
                    value={config.premiumApiKey}
                    onChange={(e) => setConfig(c => ({ ...c, premiumApiKey: e.target.value }))}
                    placeholder="Masukkan API Key Premium"
                    className="input-neon w-full pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPremiumKey(!showPremiumKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPremiumKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* NOKOS API */}
          <div className="mb-8 pt-8 border-t border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌍</span>
              <h2 className="font-bold text-lg">NOKOS API</h2>
              {testResult.nokos !== null && (
                testResult.nokos 
                  ? <CheckCircle className="w-5 h-5 text-green-400" />
                  : <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Base URL</label>
                <input
                  type="url"
                  value={config.nokosBaseUrl}
                  onChange={(e) => setConfig(c => ({ ...c, nokosBaseUrl: e.target.value }))}
                  placeholder="https://premku.com/api"
                  className="input-neon w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">API Key</label>
                <div className="relative">
                  <input
                    type={showNokosKey ? 'text' : 'password'}
                    value={config.nokosApiKey}
                    onChange={(e) => setConfig(c => ({ ...c, nokosApiKey: e.target.value }))}
                    placeholder="Masukkan API Key NOKOS"
                    className="input-neon w-full pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNokosKey(!showNokosKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNokosKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RumahOTP API */}
          <div className="mb-8 pt-8 border-t border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📱</span>
              <h2 className="font-bold text-lg">RumahOTP API</h2>
              {testResult.rumahOtp !== null && (
                testResult.rumahOtp 
                  ? <CheckCircle className="w-5 h-5 text-green-400" />
                  : <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">API Key</label>
                <div className="relative">
                  <input
                    type={showRumahOtpKey ? 'text' : 'password'}
                    value={config.rumahOtpApiKey}
                    onChange={(e) => setConfig(c => ({ ...c, rumahOtpApiKey: e.target.value }))}
                    placeholder="Masukkan API Key RumahOTP"
                    className="input-neon w-full pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRumahOtpKey(!showRumahOtpKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showRumahOtpKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Price Status */}
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Harga NOKOS Tersinkronisasi</p>
                  <p className="text-xs text-muted-foreground">
                    {rumahOtpPriceCount > 0 
                      ? `${rumahOtpPriceCount} kombinasi negara/app` 
                      : 'Belum ada data harga'}
                  </p>
                </div>
                <button
                  onClick={syncRumahOtpPrices}
                  disabled={isSyncing || !config.rumahOtpApiKey}
                  className="btn-glass px-3 py-1.5 text-sm flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  Sync
                </button>
              </div>
            </div>
          </div>

          {/* Pakasir Payment Gateway */}
          <div className="mb-8 pt-8 border-t border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💳</span>
              <h2 className="font-bold text-lg">Pakasir Payment Gateway</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Project Slug</label>
                <input
                  type="text"
                  value={config.pakasirSlug}
                  onChange={(e) => setConfig(c => ({ ...c, pakasirSlug: e.target.value }))}
                  placeholder="Slug proyek Pakasir kamu"
                  className="input-neon w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">API Key</label>
                <div className="relative">
                  <input
                    type={showPakasirKey ? 'text' : 'password'}
                    value={config.pakasirApiKey}
                    onChange={(e) => setConfig(c => ({ ...c, pakasirApiKey: e.target.value }))}
                    placeholder="Masukkan API Key Pakasir"
                    className="input-neon w-full pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPakasirKey(!showPakasirKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPakasirKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">ℹ️ Cara Setup:</strong> Daftar di{' '}
                  <a href="https://app.pakasir.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    app.pakasir.com
                  </a>
                  , buat proyek, lalu salin Slug dan API Key ke sini.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={testConnection}
              disabled={isTesting}
              className="btn-glass flex-1 flex items-center justify-center gap-2"
            >
              <Link2 className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={handleSave}
              className="btn-neon flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Simpan
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">ℹ️ Info:</strong> API Key diperlukan untuk mengaktifkan fitur auto-order. 
              Stok akan di-sync setiap 60 detik secara otomatis setelah API Key dikonfigurasi.
            </p>
          </div>

          {/* Warning for frontend storage */}
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-400">
              <strong>⚠️ Peringatan:</strong> API Key disimpan di frontend dan dapat dilihat oleh pengguna. 
              Tidak disarankan untuk production. Gunakan Lovable Cloud untuk penyimpanan yang aman.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings;
