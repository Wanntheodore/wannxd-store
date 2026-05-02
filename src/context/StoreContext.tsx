import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, Transaction, ProfitSettings, ApiConfig, StockMap, CustomPriceMap, RumahOtpPriceMap } from '@/types';
import { PRODUCTS } from '@/data/products';
import { DEFAULT_PROFIT_SETTINGS, DEFAULT_API_CONFIG, calculateSellingPrice } from '@/utils/profitEngine';
import { fetchRumahOtpPrices, getRumahOtpPrice } from '@/services/rumahOtpService';

interface StoreContextType {
  products: Product[];
  transactions: Transaction[];
  profitSettings: ProfitSettings;
  apiConfig: ApiConfig;
  stockMap: StockMap;
  customPrices: CustomPriceMap;
  rumahOtpPrices: RumahOtpPriceMap;
  isAdmin: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  
  // Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfitSettings: (settings: ProfitSettings) => void;
  updateApiConfig: (config: ApiConfig) => void;
  updateCustomPrice: (productId: string, price: number | null) => void;
  addTransaction: (transaction: Transaction) => void;
  syncStock: () => Promise<void>;
  syncRumahOtpPrices: () => Promise<void>;
  getSellingPrice: (product: Product) => { sellingPrice: number; profit: number; isCustom: boolean };
  getNokosPrice: (country: string, app: string) => { basePrice: number; sellingPrice: number; profit: number; stock: number } | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  email: 'wannxd@store.com',
  password: 'admin'
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profitSettings, setProfitSettings] = useState<ProfitSettings>(DEFAULT_PROFIT_SETTINGS);
  const [apiConfig, setApiConfig] = useState<ApiConfig>(DEFAULT_API_CONFIG);
  const [stockMap, setStockMap] = useState<StockMap>({});
  const [customPrices, setCustomPrices] = useState<CustomPriceMap>({});
  const [rumahOtpPrices, setRumahOtpPrices] = useState<RumahOtpPriceMap>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Initialize stock from products
  useEffect(() => {
    const initialStock: StockMap = {};
    products.forEach(p => {
      initialStock[p.id] = p.stock;
    });
    setStockMap(initialStock);
  }, [products]);

  // Auto-sync stock every 60 seconds if API keys are configured
  useEffect(() => {
    if (apiConfig.premiumApiKey || apiConfig.nokosApiKey) {
      const interval = setInterval(() => {
        syncStock();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [apiConfig]);

  // Fetch RumahOTP prices when API key is configured
  useEffect(() => {
    if (apiConfig.rumahOtpApiKey) {
      syncRumahOtpPrices();
    }
  }, [apiConfig.rumahOtpApiKey]);

  const syncRumahOtpPrices = useCallback(async () => {
    if (!apiConfig.rumahOtpApiKey) return;
    
    setIsSyncing(true);
    const prices = await fetchRumahOtpPrices(apiConfig.rumahOtpApiKey);
    setRumahOtpPrices(prices);
    setLastSync(new Date());
    setIsSyncing(false);
  }, [apiConfig.rumahOtpApiKey]);

  const syncStock = useCallback(async () => {
    if (!apiConfig.premiumApiKey && !apiConfig.nokosApiKey) return;
    
    setIsSyncing(true);
    
    // Simulate API call to sync stock
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newStockMap: StockMap = {};
    products.forEach(p => {
      // Simulate random stock updates from API
      const hasApiKey = p.category === 'premium' ? apiConfig.premiumApiKey : apiConfig.nokosApiKey;
      if (hasApiKey) {
        newStockMap[p.id] = Math.floor(Math.random() * 100) + 10;
      } else {
        newStockMap[p.id] = 0;
      }
    });
    
    setStockMap(newStockMap);
    setLastSync(new Date());
    setIsSyncing(false);
  }, [apiConfig, products]);

  const getNokosPrice = useCallback((country: string, app: string) => {
    const priceData = getRumahOtpPrice(rumahOtpPrices, country, app);
    if (!priceData) return null;

    const basePrice = priceData.price;
    let profit = 0;

    // Apply NOKOS profit settings
    if (profitSettings.globalEnabled) {
      if (profitSettings.globalType === 'fixed') {
        profit = profitSettings.globalValue;
      } else {
        profit = Math.round(basePrice * (profitSettings.globalValue / 100));
      }
    } else {
      if (profitSettings.nokosType === 'fixed') {
        profit = profitSettings.nokosValue;
      } else {
        profit = Math.round(basePrice * (profitSettings.nokosValue / 100));
      }
    }

    // Apply min/max limits
    profit = Math.max(profitSettings.minProfit, Math.min(profitSettings.maxProfit, profit));

    let sellingPrice = basePrice + profit;

    // Auto round
    if (profitSettings.autoRound && profitSettings.roundTo > 0) {
      sellingPrice = Math.ceil(sellingPrice / profitSettings.roundTo) * profitSettings.roundTo;
      profit = sellingPrice - basePrice;
    }

    return {
      basePrice,
      sellingPrice,
      profit,
      stock: priceData.stock,
    };
  }, [rumahOtpPrices, profitSettings]);

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const updateProfitSettings = (settings: ProfitSettings) => {
    setProfitSettings(settings);
  };

  const updateApiConfig = (config: ApiConfig) => {
    setApiConfig(config);
  };

  const updateCustomPrice = (productId: string, price: number | null) => {
    setCustomPrices(prev => ({
      ...prev,
      [productId]: price
    }));
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    // Update stock
    setStockMap(prev => ({
      ...prev,
      [transaction.productId]: Math.max(0, (prev[transaction.productId] || 0) - 1)
    }));
  };

  const getSellingPrice = (product: Product) => {
    const customPrice = customPrices[product.id];
    
    // If custom price is set, use it
    if (customPrice !== null && customPrice !== undefined) {
      const profit = customPrice - product.basePrice;
      return { sellingPrice: customPrice, profit, isCustom: true };
    }
    
    // Otherwise use profit engine calculation
    const result = calculateSellingPrice(product, profitSettings);
    return { ...result, isCustom: false };
  };

  return (
    <StoreContext.Provider value={{
      products,
      transactions,
      profitSettings,
      apiConfig,
      stockMap,
      customPrices,
      rumahOtpPrices,
      isAdmin,
      isSyncing,
      lastSync,
      login,
      logout,
      updateProfitSettings,
      updateApiConfig,
      updateCustomPrice,
      addTransaction,
      syncStock,
      syncRumahOtpPrices,
      getSellingPrice,
      getNokosPrice,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
