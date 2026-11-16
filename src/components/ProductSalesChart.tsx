import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProductSalesChartProps {
  data: { productLine: string; quantity: number; sales: number }[];
  threshold: number;
}

export const ProductSalesChart: React.FC<ProductSalesChartProps> = ({ data, threshold }) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-center min-h-[320px] text-slate-400">
        <BarChart3 className="w-10 h-10 mb-2 opacity-50" />
        <p>No product sales data available</p>
      </div>
    );
  }

  const maxQuantity = Math.max(...data.map((d) => d.quantity), threshold, 1);
  const totalQuantity = data.reduce((sum, d) => sum + d.quantity, 0);

  const colors = [
    { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', hex: '#4f46e5' },
    { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', hex: '#2563eb' },
    { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', hex: '#059669' },
    { bg: 'bg-amber-600', hover: 'hover:bg-amber-700', hex: '#d97706' },
    { bg: 'bg-rose-600', hover: 'hover:bg-rose-700', hex: '#e11d48' },
    { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', hex: '#9333ea' },
    { bg: 'bg-teal-600', hover: 'hover:bg-teal-700', hex: '#0d9488' },
  ];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800 text-base">📦 Product-wise Sales</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {data.length} Categories
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Quantity sold per product line (sorted descending)</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600"></span> Sold Qty
          </span>
          <span className="inline-flex items-center gap-1 text-amber-600">
            <span className="w-2.5 h-0.5 border-t-2 border-dashed border-amber-500"></span> Alert ({threshold})
          </span>
        </div>
      </div>

      {/* Chart visualization */}
      <div className="space-y-3.5 my-auto pt-2 pb-1">
        {data.map((item, idx) => {
          const percentage = ((item.quantity / maxQuantity) * 100).toFixed(1);
          const shareOfTotal = ((item.quantity / totalQuantity) * 100).toFixed(1);
          const isLowStock = item.quantity < threshold;
          const color = colors[idx % colors.length];
          const isHovered = hoveredProduct === item.productLine;

          return (
            <div
              key={item.productLine}
              onMouseEnter={() => setHoveredProduct(item.productLine)}
              onMouseLeave={() => setHoveredProduct(null)}
              className={`p-2 rounded-lg transition-all ${
                isHovered ? 'bg-slate-50 ring-1 ring-slate-200' : ''
              }`}
            >
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    {item.productLine}
                    {isLowStock && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                        <AlertTriangle className="w-2.5 h-2.5 text-amber-600" /> Low
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">${item.sales.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{item.quantity}</span>
                  <span className="text-slate-400 text-[11px] w-9 text-right font-mono">{shareOfTotal}%</span>
                </div>
              </div>

              {/* Bar container */}
              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                {/* Threshold Marker line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 border-r border-dashed border-amber-500 z-10"
                  style={{ left: `${(threshold / maxQuantity) * 100}%` }}
                  title={`Alert Threshold: ${threshold}`}
                />

                {/* Main Bar */}
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isLowStock ? 'bg-amber-500' : color.bg
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          <span>Leading: <strong className="text-slate-800">{data[0]?.productLine || 'None'}</strong></span>
        </span>
        <span>
          Total Volume: <strong className="text-slate-800 font-mono">{totalQuantity.toLocaleString()} units</strong>
        </span>
      </div>
    </div>
  );
};
