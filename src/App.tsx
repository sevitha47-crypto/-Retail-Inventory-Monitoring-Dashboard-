import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingCart,
  SlidersHorizontal,
  RotateCcw,
  AlertTriangle,
  Download,
  Info,
  Calendar,
  Sparkles,
  BarChart2,
  TrendingUp,
  Package,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { Transaction, FilterState, DailyTrendPoint } from './types/inventory';
import { parseCSV, exportToCSV } from './data/inventoryLoader';
import { SidebarFilters } from './components/SidebarFilters';
import { KPICards } from './components/KPICards';
import { ProductSalesChart } from './components/ProductSalesChart';
import { DailyTrendChart } from './components/DailyTrendChart';
import { FastSlowProducts } from './components/FastSlowProducts';
import { LowStockAlert } from './components/LowStockAlert';
import { InsightsBanner } from './components/InsightsBanner';
import { DataTable } from './components/DataTable';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<number>(50);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'charts' | 'stock' | 'data'>('all');

  // Load default dataset
  const loadDefaultData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await fetch('/SuperMarket Analysis.csv');
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.statusText}`);
      }
      const text = await response.text();
      const parsed = parseCSV(text);
      setTransactions(parsed);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setLoadError(err.message || 'Failed to load initial dataset');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDefaultData();
  }, []);

  // Compute available unique values for filters
  const availableBranches = useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.branch))).filter(Boolean);
  }, [transactions]);

  const availableCities = useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.city))).filter(Boolean);
  }, [transactions]);

  const availableProductLines = useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.productLine))).filter(Boolean);
  }, [transactions]);

  const availableCustomerTypes = useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.customerType))).filter(Boolean);
  }, [transactions]);

  // Filters State - matching Streamlit default: all selected!
  const [filters, setFilters] = useState<FilterState>({
    branches: [],
    cities: [],
    productLines: [],
    customerTypes: [],
    dateRange: { start: '', end: '' },
    searchTerm: '',
  });

  // Once unique values load, initialize default filters to all selected
  useEffect(() => {
    if (availableBranches.length > 0 && availableCities.length > 0) {
      setFilters((prev) => ({
        ...prev,
        branches: prev.branches.length === 0 ? [...availableBranches] : prev.branches,
        cities: prev.cities.length === 0 ? [...availableCities] : prev.cities,
        productLines: prev.productLines.length === 0 ? [...availableProductLines] : prev.productLines,
        customerTypes: prev.customerTypes.length === 0 ? [...availableCustomerTypes] : prev.customerTypes,
      }));
    }
  }, [availableBranches, availableCities, availableProductLines, availableCustomerTypes]);

  // Filter application matching:
  // filtered_df = df[(df["Branch"].isin(branch)) & (df["City"].isin(city))]
  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      // Branch filter
      if (filters.branches.length > 0 && !filters.branches.includes(item.branch)) {
        return false;
      }
      // City filter
      if (filters.cities.length > 0 && !filters.cities.includes(item.city)) {
        return false;
      }
      // Customer Type filter
      if (filters.customerTypes.length > 0 && !filters.customerTypes.includes(item.customerType)) {
        return false;
      }
      // Product Line filter
      if (filters.productLines.length > 0 && !filters.productLines.includes(item.productLine)) {
        return false;
      }
      return true;
    });
  }, [transactions, filters]);

  // Reset filters handler
  const handleResetFilters = () => {
    setFilters({
      branches: [...availableBranches],
      cities: [...availableCities],
      productLines: [...availableProductLines],
      customerTypes: [...availableCustomerTypes],
      dateRange: { start: '', end: '' },
      searchTerm: '',
    });
  };

  // Upload custom CSV file handler
  const handleUploadCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const parsed = parseCSV(text);
        if (parsed.length > 0) {
          setTransactions(parsed);
          // Auto select all newly found branches & cities
          const newBranches = Array.from(new Set(parsed.map((t) => t.branch))).filter(Boolean);
          const newCities = Array.from(new Set(parsed.map((t) => t.city))).filter(Boolean);
          const newProds = Array.from(new Set(parsed.map((t) => t.productLine))).filter(Boolean);
          const newCust = Array.from(new Set(parsed.map((t) => t.customerType))).filter(Boolean);
          setFilters({
            branches: newBranches,
            cities: newCities,
            productLines: newProds,
            customerTypes: newCust,
            dateRange: { start: '', end: '' },
            searchTerm: '',
          });
        }
      }
    };
    reader.readAsText(file);
  };

  // KPI calculations:
  // total_quantity = int(filtered_df["Quantity"].sum())
  // avg_quantity = round(filtered_df["Quantity"].mean(), 2)
  // transactions = filtered_df.shape[0]
  const totalQuantity = useMemo(() => {
    return filteredTransactions.reduce((sum, item) => sum + item.quantity, 0);
  }, [filteredTransactions]);

  const avgQuantity = useMemo(() => {
    if (filteredTransactions.length === 0) return 0;
    return Number((totalQuantity / filteredTransactions.length).toFixed(2));
  }, [filteredTransactions, totalQuantity]);

  const transactionsCount = filteredTransactions.length;

  const totalSales = useMemo(() => {
    return filteredTransactions.reduce((sum, item) => sum + item.sales, 0);
  }, [filteredTransactions]);

  const grossIncome = useMemo(() => {
    return filteredTransactions.reduce((sum, item) => sum + item.grossIncome, 0);
  }, [filteredTransactions]);

  // Product-wise Sales aggregation:
  // product_data = filtered_df.groupby("Product line")["Quantity"].sum().sort_values(ascending=False)
  const productData = useMemo(() => {
    const map = new Map<string, { quantity: number; sales: number }>();
    filteredTransactions.forEach((t) => {
      const existing = map.get(t.productLine) || { quantity: 0, sales: 0 };
      map.set(t.productLine, {
        quantity: existing.quantity + t.quantity,
        sales: existing.sales + t.sales,
      });
    });

    return Array.from(map.entries())
      .map(([productLine, stats]) => ({
        productLine,
        quantity: stats.quantity,
        sales: stats.sales,
      }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [filteredTransactions]);

  // Daily Sales Trend aggregation:
  // date_data = filtered_df.groupby("Date")["Quantity"].sum()
  const dailyTrendData = useMemo<DailyTrendPoint[]>(() => {
    const map = new Map<string, { quantity: number; sales: number; count: number }>();
    filteredTransactions.forEach((t) => {
      if (!t.date) return;
      const existing = map.get(t.date) || { quantity: 0, sales: 0, count: 0 };
      map.set(t.date, {
        quantity: existing.quantity + t.quantity,
        sales: existing.sales + t.sales,
        count: existing.count + 1,
      });
    });

    return Array.from(map.entries())
      .map(([date, stats]) => {
        let displayDate = date;
        try {
          const parts = date.split('-');
          if (parts.length === 3) {
            const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            displayDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          }
        } catch {
          displayDate = date;
        }

        return {
          date,
          displayDate,
          quantity: stats.quantity,
          sales: stats.sales,
          transactions: stats.count,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredTransactions]);

  // Fast & Slow moving products:
  // fast = product_data.head(3)
  // slow = product_data.tail(3)
  const fastProducts = useMemo(() => {
    return productData.slice(0, 3).map((p) => ({
      ...p,
      share: totalQuantity > 0 ? (p.quantity / totalQuantity) * 100 : 0,
    }));
  }, [productData, totalQuantity]);

  const slowProducts = useMemo(() => {
    if (productData.length <= 3) {
      return [];
    }
    return productData.slice(-3).map((p) => ({
      ...p,
      share: totalQuantity > 0 ? (p.quantity / totalQuantity) * 100 : 0,
    }));
  }, [productData, totalQuantity]);

  // Insights:
  // top_product = product_data.idxmax()
  // least_product = product_data.idxmin()
  const topProduct = productData[0]?.productLine || 'None';
  const topProductQty = productData[0]?.quantity || 0;
  const leastProduct = productData[productData.length - 1]?.productLine || 'None';
  const leastProductQty = productData[productData.length - 1]?.quantity || 0;

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 font-sans antialiased">
      {/* Top Banner Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-tr from-indigo-600 to-blue-600 text-white shadow-xs">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                🛒 Retail Inventory Monitoring Dashboard
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Analyze product demand and monitor inventory usage efficiently.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Export CSV button */}
            <button
              onClick={() => exportToCSV(filteredTransactions, 'filtered_data.csv')}
              disabled={filteredTransactions.length === 0}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto text-xs font-medium border-t border-slate-100 py-1.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Dashboard All-in-One
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'charts'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" /> Charts & Trends
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'stock'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> Low Stock & Velocity
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'data'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Download & Data ({filteredTransactions.length})
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Section */}
          <aside
            className={`lg:col-span-3 lg:block ${
              isMobileFilterOpen ? 'block fixed inset-0 z-50 p-4 bg-slate-900/60 backdrop-blur-xs' : 'hidden'
            }`}
          >
            <div className={`${isMobileFilterOpen ? 'max-w-md mx-auto max-h-[90vh] overflow-y-auto' : ''}`}>
              {isMobileFilterOpen && (
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 rounded-lg bg-slate-800 text-white font-bold text-xs"
                  >
                    ✕ Close Filters
                  </button>
                </div>
              )}
              <SidebarFilters
                availableBranches={availableBranches}
                availableCities={availableCities}
                availableProductLines={availableProductLines}
                availableCustomerTypes={availableCustomerTypes}
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={handleResetFilters}
                onUploadCsv={handleUploadCsv}
                onRestoreDefault={loadDefaultData}
                totalRecordsCount={transactions.length}
                filteredRecordsCount={filteredTransactions.length}
              />
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Handle Empty Data Warning */}
            {filteredTransactions.length === 0 ? (
              <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-8 text-center space-y-4">
                <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-700">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-900">
                    ⚠ No data available for selected filters.
                  </h3>
                  <p className="text-xs text-amber-700 max-w-md mx-auto mt-1">
                    None of the {transactions.length} records match the current combinations of Branch, City, or Category filters.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <>
                {/* 1. KPI SECTION */}
                <KPICards
                  totalQuantity={totalQuantity}
                  avgQuantity={avgQuantity}
                  transactions={transactionsCount}
                  totalSales={totalSales}
                  grossIncome={grossIncome}
                />

                {/* 2. CHARTS SECTION (Col 1 & Col 2) */}
                {(activeTab === 'all' || activeTab === 'charts') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <ProductSalesChart data={productData} threshold={threshold} />
                    <DailyTrendChart data={dailyTrendData} />
                  </div>
                )}

                {/* 3. FAST & SLOW PRODUCTS */}
                {(activeTab === 'all' || activeTab === 'stock') && (
                  <FastSlowProducts fast={fastProducts} slow={slowProducts} />
                )}

                {/* 4. LOW STOCK ALERT */}
                {(activeTab === 'all' || activeTab === 'stock') && (
                  <LowStockAlert
                    threshold={threshold}
                    onThresholdChange={setThreshold}
                    productData={productData}
                  />
                )}

                {/* 5. INSIGHTS */}
                {(activeTab === 'all' || activeTab === 'charts') && (
                  <InsightsBanner
                    topProduct={topProduct}
                    topProductQty={topProductQty}
                    leastProduct={leastProduct}
                    leastProductQty={leastProductQty}
                    totalQuantity={totalQuantity}
                    transactions={transactionsCount}
                    avgQuantity={avgQuantity}
                  />
                )}

                {/* 6. DOWNLOAD & DATA TABLE SECTION */}
                {(activeTab === 'all' || activeTab === 'data') && (
                  <DataTable data={filteredTransactions} />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-700">Retail Inventory Monitoring Dashboard</p>
        <p className="mt-1 text-slate-400">
          Generated faithfully from the Streamlit SuperMarket Analysis application specifications.
        </p>
      </footer>
    </div>
  );
}
