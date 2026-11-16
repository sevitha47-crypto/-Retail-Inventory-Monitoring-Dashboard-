import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, ShoppingCart, RefreshCw } from 'lucide-react';

interface LowStockAlertProps {
  threshold: number;
  onThresholdChange: (value: number) => void;
  productData: { productLine: string; quantity: number; sales: number }[];
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({
  threshold,
  onThresholdChange,
  productData,
}) => {
  const lowStock = productData.filter((p) => p.quantity < threshold);
  const healthyCount = productData.length - lowStock.length;

  const presets = [20, 35, 50, 75, 100];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-semibold text-slate-800 text-base flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-100 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </span>
            ⚠ Low Stock Alert System
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Flag products where current sales volume falls below the safety buffer
          </p>
        </div>

        {/* Threshold Slider control */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
          <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
            Threshold: <strong className="text-indigo-600 font-mono text-sm">{threshold}</strong> units
          </span>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={threshold}
            onChange={(e) => onThresholdChange(Number(e.target.value))}
            className="w-28 sm:w-36 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex items-center gap-1">
            {presets.map((val) => (
              <button
                key={val}
                onClick={() => onThresholdChange(val)}
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                  threshold === val
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Status Banner */}
      {lowStock.length > 0 ? (
        <div className="space-y-4">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-rose-900">
                  Low Stock Products Alert ({lowStock.length} categories below {threshold} units)
                </h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-1">
                The items listed below have units below the critical threshold of <strong>{threshold}</strong>.
                Replenish procurement orders immediately to avoid stockout downtime.
              </p>
            </div>
          </div>

          {/* Low Stock Data Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Product Line</th>
                  <th className="px-4 py-2.5 text-center">Current Quantity</th>
                  <th className="px-4 py-2.5 text-center">Safety Deficit</th>
                  <th className="px-4 py-2.5 text-right">Sales Value</th>
                  <th className="px-4 py-2.5 text-center">Stock Health</th>
                  <th className="px-4 py-2.5 text-right">Suggested Reorder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStock.map((item) => {
                  const deficit = threshold - item.quantity;
                  const suggestedReorder = Math.max(deficit * 2, 25);
                  return (
                    <tr key={item.productLine} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {item.productLine}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-mono font-bold">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-rose-600 font-medium">
                        -{deficit} units
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-600">
                        ${item.sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                          Under Stocked
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 text-white font-mono text-[11px] font-medium shadow-2xs">
                          <ShoppingCart className="w-3 h-3 text-slate-300" /> +{suggestedReorder}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">
                All products have healthy stock levels
              </h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                Every category exceeds the active threshold of <strong>{threshold} units</strong>. Zero immediate stockout risk.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-200/70 text-emerald-800">
            {healthyCount} / {productData.length} OK
          </span>
        </div>
      )}
    </div>
  );
};
