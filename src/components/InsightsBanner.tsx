import React from 'react';
import { Lightbulb, Flame, Snail, Award, ShoppingBag, CreditCard, Sparkles } from 'lucide-react';

interface InsightsBannerProps {
  topProduct: string;
  topProductQty: number;
  leastProduct: string;
  leastProductQty: number;
  totalQuantity: number;
  transactions: number;
  avgQuantity: number;
}

export const InsightsBanner: React.FC<InsightsBannerProps> = ({
  topProduct,
  topProductQty,
  leastProduct,
  leastProductQty,
  totalQuantity,
  transactions,
  avgQuantity,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
          <Lightbulb className="w-4 h-4" />
        </span>
        <div>
          <h3 className="font-semibold text-slate-800 text-base">💡 Inventory Insights & Strategy</h3>
          <p className="text-xs text-slate-500">Actionable demand signals calculated from filtered transaction records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
        {/* Most Demanded Product */}
        <div className="p-4 rounded-xl bg-linear-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-xs shrink-0">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Most Demanded Product Line
              </span>
              <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-md">
                {topProductQty} units
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-0.5">
              {topProduct}
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Represents {((topProductQty / (totalQuantity || 1)) * 100).toFixed(1)}% of all volume sold. Keep safety stock high and ensure continuous supplier replenishment.
            </p>
          </div>
        </div>

        {/* Least Demanded Product */}
        <div className="p-4 rounded-xl bg-linear-to-br from-slate-50 to-sky-50/60 border border-sky-200/80 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-sky-600 text-white shadow-xs shrink-0">
            <Snail className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
                Least Demanded Product Line
              </span>
              <span className="text-xs font-mono font-bold text-sky-900 bg-sky-200/60 px-2 py-0.5 rounded-md">
                {leastProductQty} units
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-0.5">
              {leastProduct}
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Lowest demand turnover in this filter view. Consider bundle discounts, cross-merchandising, or reducing order lot sizes.
            </p>
          </div>
        </div>
      </div>

      {/* Analytical Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2.5">
          <ShoppingBag className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-slate-600">
            Avg basket order: <strong className="text-slate-900">{avgQuantity} items</strong> per checkout
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2.5">
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-600">
            Demand disparity: <strong className="text-slate-900">{(topProductQty / Math.max(leastProductQty, 1)).toFixed(1)}x ratio</strong> top to bottom
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <span className="text-slate-600">
            Total sales transactions: <strong className="text-slate-900">{transactions} receipts</strong> logged
          </span>
        </div>
      </div>
    </div>
  );
};
