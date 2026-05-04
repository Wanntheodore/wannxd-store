import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { formatCurrency } from '@/utils/profitEngine';

const AdminTransactions = () => {
  const { transactions } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.productName.toLowerCase().includes(search.toLowerCase()) ||
                          tx.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || tx.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Produk', 'Kategori', 'Modal', 'Harga Jual', 'Profit', 'Metode', 'Status', 'Tanggal'];
    const rows = transactions.map(tx => [
      tx.id,
      tx.productName,
      tx.category,
      tx.basePrice,
      tx.sellingPrice,
      tx.profit,
      tx.paymentMethod,
      tx.status,
      new Date(tx.createdAt).toLocaleString('id-ID')
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Calculate totals
  const totalModal = filteredTransactions.reduce((sum, tx) => sum + tx.basePrice, 0);
  const totalRevenue = filteredTransactions.reduce((sum, tx) => sum + tx.sellingPrice, 0);
  const totalProfit = filteredTransactions.reduce((sum, tx) => sum + tx.profit, 0);

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Riwayat Transaksi
              </h1>
              <p className="text-muted-foreground text-sm">{transactions.length} transaksi</p>
            </div>
          </div>
          <button onClick={exportCSV} className="btn-glass flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <p className="text-sm text-muted-foreground">Total Modal</p>
            <p className="text-xl font-bold">{formatCurrency(totalModal)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4"
          >
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 neon-border"
          >
            <p className="text-sm text-muted-foreground">Total Profit</p>
            <p className="text-xl font-bold text-green-400">+{formatCurrency(totalProfit)}</p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 mb-6"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari transaksi..."
              className="input-neon w-full pl-12"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="input-neon"
            >
              <option value="all">Semua Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card overflow-hidden"
        >
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada transaksi ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/50 bg-muted/30">
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="p-4 font-medium">ID</th>
                    <th className="p-4 font-medium">Produk</th>
                    <th className="p-4 font-medium">Modal</th>
                    <th className="p-4 font-medium">Harga Jual</th>
                    <th className="p-4 font-medium">Profit</th>
                    <th className="p-4 font-medium">Metode</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/30 hover:bg-muted/30"
                    >
                      <td className="p-4 font-mono text-sm">{tx.id}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{tx.productName}</p>
                          {tx.orderId && (
                            <p className="text-xs text-muted-foreground">
                              Order: {tx.orderId}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{formatCurrency(tx.basePrice)}</td>
                      <td className="p-4">{formatCurrency(tx.sellingPrice)}</td>
                      <td className="p-4 text-green-400 font-medium">+{formatCurrency(tx.profit)}</td>
                      <td className="p-4 uppercase text-sm">{tx.paymentMethod}</td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          tx.status === 'success' ? 'bg-green-500/20 text-green-400' :
                          tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleString('id-ID')}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminTransactions;
