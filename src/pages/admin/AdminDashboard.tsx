import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, DollarSign, ShoppingBag, Package, 
  Settings, FileText, Key, RefreshCw, AlertTriangle, Tag
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatCurrency } from '@/utils/profitEngine';

const AdminDashboard = () => {
  const { transactions, products, stockMap, apiConfig, isSyncing, syncStock, lastSync } = useStore();

  // Calculate stats
  const totalSales = transactions.filter(t => t.status === 'success').length;
  const totalRevenue = transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.sellingPrice, 0);
  const totalProfit = transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.profit, 0);
  const lowStockCount = products.filter(p => (stockMap[p.id] || p.stock) < 10).length;

  // Today's stats
  const today = new Date().toDateString();
  const todayTransactions = transactions.filter(t => 
    t.status === 'success' && new Date(t.createdAt).toDateString() === today
  );
  const todayProfit = todayTransactions.reduce((sum, t) => sum + t.profit, 0);

  const stats = [
    { 
      label: 'Total Pesanan', 
      value: totalSales, 
      icon: ShoppingBag,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      label: 'Total Revenue', 
      value: formatCurrency(totalRevenue), 
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Total Profit', 
      value: formatCurrency(totalProfit), 
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Profit Hari Ini', 
      value: formatCurrency(todayProfit), 
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-500'
    },
  ];

  const quickLinks = [
    { to: '/admin/profit', label: 'Profit Settings', icon: TrendingUp, desc: 'Atur margin keuntungan' },
    { to: '/admin/custom-prices', label: 'Custom Harga', icon: Tag, desc: 'Override harga per produk' },
    { to: '/admin/transactions', label: 'Transaksi', icon: FileText, desc: 'Lihat riwayat penjualan' },
    { to: '/admin/settings', label: 'API Config', icon: Key, desc: 'Kelola API supplier' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Admin Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Kelola toko dan pantau performa bisnis
          </p>
        </motion.div>

        {/* API Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${apiConfig.premiumApiKey ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-sm">
                Premium API: <span className={apiConfig.premiumApiKey ? 'status-online' : 'status-offline'}>
                  {apiConfig.premiumApiKey ? 'Connected' : 'Not Set'}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${apiConfig.nokosApiKey ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-sm">
                NOKOS API: <span className={apiConfig.nokosApiKey ? 'status-online' : 'status-offline'}>
                  {apiConfig.nokosApiKey ? 'Connected' : 'Not Set'}
                </span>
              </span>
            </div>
          </div>
          <button
            onClick={syncStock}
            disabled={isSyncing || (!apiConfig.premiumApiKey && !apiConfig.nokosApiKey)}
            className="flex items-center gap-2 text-sm btn-glass py-2 px-4 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Stock'}
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="glass-card p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Alerts */}
        {lowStockCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-4 mb-8 border-yellow-500/50 flex items-center gap-3"
          >
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="font-semibold text-yellow-400">Low Stock Alert</p>
              <p className="text-sm text-muted-foreground">
                {lowStockCount} produk memiliki stok kurang dari 10
              </p>
            </div>
          </motion.div>
        )}

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={link.to}
                to={link.to}
                className="glass-card p-6 hover:neon-border transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <link.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold group-hover:gradient-text transition-all">{link.label}</p>
                    <p className="text-sm text-muted-foreground">{link.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Transaksi Terbaru</h2>
            <Link to="/admin/transactions" className="text-sm text-primary hover:underline">
              Lihat Semua →
            </Link>
          </div>
          <div className="glass-card overflow-hidden">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Belum ada transaksi
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="p-4">ID</th>
                      <th className="p-4">Produk</th>
                      <th className="p-4">Harga Jual</th>
                      <th className="p-4">Profit</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map(tx => (
                      <tr key={tx.id} className="border-b border-border/30 hover:bg-muted/30">
                        <td className="p-4 font-mono text-sm">{tx.id}</td>
                        <td className="p-4 font-medium">{tx.productName}</td>
                        <td className="p-4">{formatCurrency(tx.sellingPrice)}</td>
                        <td className="p-4 text-green-400">+{formatCurrency(tx.profit)}</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            tx.status === 'success' ? 'bg-green-500/20 text-green-400' :
                            tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {tx.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
