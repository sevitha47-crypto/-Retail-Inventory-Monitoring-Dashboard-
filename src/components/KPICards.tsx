import React from 'react';
import { PackageCheck, Layers, Receipt, DollarSign, TrendingUp, Sparkles } from 'lucide-react';

interface KPICardsProps {
  totalQuantity: number;
  avgQuantity: number;
  transactions: number;
  totalSales: number;
  grossIncome: number;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalQuantity,
  avgQuantity,
  transactions,
  totalSales,
  grossIncome,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>📊</span> Inventory Overview
        </h2>
        <span className="text-xs text-slate-500 font-medium">Real-time KPI calculations</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Total Quantity Sold */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Quantity Sold
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-1">
                {totalQuantity.toLocaleString()}
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Direct inventory turnover
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <PackageCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
        </div>

        {/* KPI 2: Average Quantity */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Average Quantity
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-1">
                {avgQuantity.toFixed(2)}
              </h3>
              <p className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Units per transaction
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
        </div>

        {/* KPI 3: Transactions */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Transactions
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-1">
                {transactions.toLocaleString()}
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5" /> Orders processed
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>
      </div>

      {/* Auxiliary Retail Financial Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100/60 text-emerald-700">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Total Sales Value</span>
            <p className="font-mono font-bold text-slate-800 text-sm">
              ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100/60 text-purple-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Gross Income (5%)</span>
            <p className="font-mono font-bold text-slate-800 text-sm">
              ${grossIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-slate-50/80 border border-slate-200/60 rounded-lg p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100/60 text-blue-700">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Avg Basket Revenue</span>
            <p className="font-mono font-bold text-slate-800 text-sm">
              ${transactions > 0 ? (totalSales / transactions).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
