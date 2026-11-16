import React from 'react';
import { Flame, Snail, TrendingUp, AlertCircle } from 'lucide-react';

interface ProductVelocityItem {
  productLine: string;
  quantity: number;
  sales: number;
  share: number;
}

interface FastSlowProductsProps {
  fast: ProductVelocityItem[];
  slow: ProductVelocityItem[];
}

export const FastSlowProducts: React.FC<FastSlowProductsProps> = ({ fast, slow }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-base flex items-center gap-2">
            <span>⚡</span> Fast & Slow Moving Products
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify top demand drivers vs items needing promotion or markdown
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fast Moving */}
        <div className="bg-orange-50/40 border border-orange-200/80 rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-orange-200/60 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-600" />
              </span>
              <div>
                <h4 className="font-bold text-orange-950 text-sm">🔥 Fast Moving</h4>
                <p className="text-[11px] text-orange-700/80">Top 3 highest volume products</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-200/60 text-orange-800">
              High Velocity
            </span>
          </div>

          <div className="space-y-2.5">
            {fast.map((item, index) => (
              <div
                key={item.productLine}
                className="bg-white/90 p-3 rounded-lg border border-orange-200/50 flex items-center justify-between shadow-2xs hover:border-orange-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center font-mono">
                    #{index + 1}
                  </span>
                  <div>
                    <h5 className="font-semibold text-slate-800 text-xs sm:text-sm">{item.productLine}</h5>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ${item.sales.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} revenue
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-900 font-mono text-sm block">
                    {item.quantity} <span className="text-[10px] font-normal text-slate-500">units</span>
                  </span>
                  <span className="text-[11px] font-medium text-orange-600">
                    {item.share.toFixed(1)}% demand
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slow Moving */}
        <div className="bg-sky-50/40 border border-sky-200/80 rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-sky-200/60 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                <Snail className="w-4 h-4 text-sky-700" />
              </span>
              <div>
                <h4 className="font-bold text-sky-950 text-sm">🐢 Slow Moving</h4>
                <p className="text-[11px] text-sky-700/80">Bottom 3 lowest volume products</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-200/60 text-sky-800">
              Low Velocity
            </span>
          </div>

          <div className="space-y-2.5">
            {slow.map((item, index) => (
              <div
                key={item.productLine}
                className="bg-white/90 p-3 rounded-lg border border-sky-200/50 flex items-center justify-between shadow-2xs hover:border-sky-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center font-mono">
                    #{fast.length + index + 1}
                  </span>
                  <div>
                    <h5 className="font-semibold text-slate-800 text-xs sm:text-sm">{item.productLine}</h5>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ${item.sales.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} revenue
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-900 font-mono text-sm block">
                    {item.quantity} <span className="text-[10px] font-normal text-slate-500">units</span>
                  </span>
                  <span className="text-[11px] font-medium text-sky-700">
                    {item.share.toFixed(1)}% demand
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
