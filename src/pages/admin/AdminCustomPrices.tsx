import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Tag, Save, X, Search, CheckSquare, Square, Percent, Trash2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatCurrency } from '@/utils/profitEngine';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const AdminCustomPrices = () => {
  const { products, customPrices, updateCustomPrice, getSellingPrice } = useStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  
  // Bulk edit states
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState<'fixed' | 'percentage' | 'markup'>('fixed');
  const [bulkValue, setBulkValue] = useState<string>('');
  const [showBulkPanel, setShowBulkPanel] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (productId: string) => {
    const currentCustomPrice = customPrices[productId];
    setEditingProduct(productId);
    setTempPrice(currentCustomPrice !== null && currentCustomPrice !== undefined ? currentCustomPrice.toString() : '');
  };

  const handleSave = (productId: string, basePrice: number) => {
    const price = tempPrice ? parseInt(tempPrice) : null;
    
    if (price !== null && price < basePrice) {
      toast({
        title: "Error",
        description: "Harga custom tidak boleh lebih rendah dari harga dasar!",
        variant: "destructive"
      });
      return;
    }

    updateCustomPrice(productId, price);
    setEditingProduct(null);
    setTempPrice('');
    
    toast({
      title: "Berhasil!",
      description: price ? `Harga custom ${formatCurrency(price)} tersimpan` : "Custom price dihapus, menggunakan profit engine"
    });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setTempPrice('');
  };

  const handleClearCustomPrice = (productId: string) => {
    updateCustomPrice(productId, null);
    toast({
      title: "Custom Price Dihapus",
      description: "Produk akan menggunakan kalkulasi dari Profit Engine"
    });
  };

  // Bulk edit functions
  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAllFiltered = () => {
    const allFilteredIds = new Set(filteredProducts.map(p => p.id));
    setSelectedProducts(allFilteredIds);
  };

  const clearSelection = () => {
    setSelectedProducts(new Set());
    setShowBulkPanel(false);
    setBulkValue('');
  };

  const applyBulkPrice = () => {
    if (!bulkValue || selectedProducts.size === 0) {
      toast({
        title: "Error",
        description: "Masukkan nilai dan pilih minimal 1 produk!",
        variant: "destructive"
      });
      return;
    }

    const value = parseInt(bulkValue);
    let appliedCount = 0;
    let skippedCount = 0;

    selectedProducts.forEach(productId => {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      let newPrice: number;

      switch (bulkMode) {
        case 'fixed':
          // Set fixed price directly
          newPrice = value;
          break;
        case 'percentage':
          // Add percentage markup to base price
          newPrice = Math.round(product.basePrice * (1 + value / 100));
          break;
        case 'markup':
          // Add fixed markup to base price
          newPrice = product.basePrice + value;
          break;
        default:
          newPrice = value;
      }

      if (newPrice >= product.basePrice) {
        updateCustomPrice(productId, newPrice);
        appliedCount++;
      } else {
        skippedCount++;
      }
    });

    toast({
      title: "Bulk Edit Selesai!",
      description: `${appliedCount} produk diupdate${skippedCount > 0 ? `, ${skippedCount} dilewati (harga < base)` : ''}`
    });

    clearSelection();
  };

  const bulkClearPrices = () => {
    selectedProducts.forEach(productId => {
      updateCustomPrice(productId, null);
    });

    toast({
      title: "Custom Prices Dihapus",
      description: `${selectedProducts.size} produk dikembalikan ke harga otomatis`
    });

    clearSelection();
  };

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Custom Harga</span>
          </h1>
          <p className="text-muted-foreground">
            Atur harga custom per produk (override profit engine)
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6 border-primary/30"
        >
          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary mb-1">Cara Kerja Custom Price</p>
              <p className="text-muted-foreground">
                Produk dengan custom price akan mengabaikan kalkulasi dari Profit Engine. 
                Gunakan checkbox untuk memilih beberapa produk sekaligus (Bulk Edit).
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bulk Action Bar */}
        <AnimatePresence>
          {selectedProducts.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-4 mb-6 border-primary/50 bg-primary/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-5 h-5 text-primary" />
                  <span className="font-bold text-primary">{selectedProducts.size} produk dipilih</span>
                </div>

                {!showBulkPanel ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setShowBulkPanel(true)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Set Harga Bulk
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={bulkClearPrices}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus Custom
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearSelection}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Mode selector */}
                    <div className="flex rounded-lg overflow-hidden border border-border/50">
                      <button
                        onClick={() => setBulkMode('fixed')}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                          bulkMode === 'fixed' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        <DollarSign className="w-3 h-3 inline mr-1" />
                        Harga Tetap
                      </button>
                      <button
                        onClick={() => setBulkMode('percentage')}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                          bulkMode === 'percentage' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Percent className="w-3 h-3 inline mr-1" />
                        % Markup
                      </button>
                      <button
                        onClick={() => setBulkMode('markup')}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                          bulkMode === 'markup' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        + Nominal
                      </button>
                    </div>

                    <Input
                      type="number"
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                      placeholder={bulkMode === 'percentage' ? 'Contoh: 15' : 'Contoh: 50000'}
                      className="w-36 h-9 bg-background/50"
                    />

                    <Button
                      size="sm"
                      onClick={applyBulkPrice}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Terapkan
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowBulkPanel(false);
                        setBulkValue('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {showBulkPanel && (
                <p className="text-xs text-muted-foreground mt-3">
                  {bulkMode === 'fixed' && '💡 Semua produk terpilih akan memiliki harga yang sama'}
                  {bulkMode === 'percentage' && '💡 Harga = Harga Dasar × (1 + Persentase/100)'}
                  {bulkMode === 'markup' && '💡 Harga = Harga Dasar + Nominal Markup'}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Select All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-wrap gap-4"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/50"
            />
          </div>
          <Button
            variant="outline"
            onClick={selectAllFiltered}
            className="border-border/50"
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Pilih Semua ({filteredProducts.length})
          </Button>
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/50 bg-muted/30">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="p-4 w-12">
                    <Checkbox
                      checked={filteredProducts.length > 0 && filteredProducts.every(p => selectedProducts.has(p.id))}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          selectAllFiltered();
                        } else {
                          clearSelection();
                        }
                      }}
                    />
                  </th>
                  <th className="p-4">Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga Dasar</th>
                  <th className="p-4">Harga Jual</th>
                  <th className="p-4">Custom Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const priceInfo = getSellingPrice(product);
                  const hasCustomPrice = customPrices[product.id] !== null && customPrices[product.id] !== undefined;
                  const isEditing = editingProduct === product.id;
                  const isSelected = selectedProducts.has(product.id);

                  return (
                    <tr 
                      key={product.id} 
                      className={`border-b border-border/30 transition-colors ${
                        isSelected ? 'bg-primary/10' : 'hover:bg-muted/20'
                      }`}
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleProductSelection(product.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{product.icon}</span>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          product.category === 'premium' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {product.category.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-muted-foreground">
                        {formatCurrency(product.basePrice)}
                      </td>
                      <td className="p-4 font-mono font-bold">
                        {formatCurrency(priceInfo.sellingPrice)}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              placeholder="Kosongkan = auto"
                              className="w-32 h-8 text-sm bg-background/50"
                            />
                          </div>
                        ) : (
                          <span className={`font-mono ${hasCustomPrice ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                            {hasCustomPrice ? formatCurrency(customPrices[product.id]!) : '-'}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {hasCustomPrice ? (
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary/20 text-primary">
                            CUSTOM
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-muted/50 text-muted-foreground">
                            AUTO
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSave(product.id, product.basePrice)}
                              className="h-8 px-3 bg-green-600 hover:bg-green-700"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancel}
                              className="h-8 px-3"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(product.id)}
                              className="h-8 px-3 border-primary/50 text-primary hover:bg-primary/10"
                            >
                              <DollarSign className="w-4 h-4 mr-1" />
                              Set
                            </Button>
                            {hasCustomPrice && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleClearCustomPrice(product.id)}
                                className="h-8 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 glass-card p-4"
        >
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Total Produk:</span>
              <span className="ml-2 font-bold">{products.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Custom Price Aktif:</span>
              <span className="ml-2 font-bold text-primary">
                {Object.values(customPrices).filter(p => p !== null && p !== undefined).length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Menggunakan Auto:</span>
              <span className="ml-2 font-bold">
                {products.length - Object.values(customPrices).filter(p => p !== null && p !== undefined).length}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminCustomPrices;
