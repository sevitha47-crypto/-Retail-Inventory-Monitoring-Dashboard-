import React, { useState, useMemo } from 'react';
import { LineChart as LineChartIcon, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DailyTrendPoint } from '../types/inventory';

interface DailyTrendChartProps {
  data: DailyTrendPoint[];
}

export const DailyTrendChart: React.FC<DailyTrendChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<DailyTrendPoint | null>(null);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  if (sortedData.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center min-h-[320px] text-slate-400">
        <LineChartIcon className="w-10 h-10 mb-2 opacity-50" />
        <p>No date trend data available</p>
      </div>
    );
  }

  const quantities = sortedData.map((d) => d.quantity);
  const maxQty = Math.max(...quantities, 10);
  const minQty = Math.min(...quantities);
  const avgQty = (quantities.reduce((a, b) => a + b, 0) / quantities.length).toFixed(1);

  // Highest & lowest day
  const highestDay = sortedData.reduce((prev, curr) => (curr.quantity > prev.quantity ? curr : prev), sortedData[0]);
  const lowestDay = sortedData.reduce((prev, curr) => (curr.quantity < prev.quantity ? curr : prev), sortedData[0]);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 35;
  const paddingY = 25;

  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  const points = sortedData.map((d, index) => {
    const x = paddingX + (index / Math.max(sortedData.length - 1, 1)) * chartW;
    const y = paddingY + chartH - ((d.quantity - 0) / (maxQty * 1.1)) * chartH;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x.toFixed(1)},${svgHeight - paddingY} L ${points[0].x.toFixed(1)},${svgHeight - paddingY} Z`
    : '';

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800 text-base">📈 Daily Sales Trend</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
              {sortedData.length} Days
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Aggregated quantity purchased per calendar day</p>
        </div>

        {/* Quick summary pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> Peak: {highestDay.quantity}
          </span>
          <span className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
            Avg: {avgQty}/day
          </span>
        </div>
      </div>

      {/* Hover info banner */}
      <div className="h-6 mb-1 text-xs flex items-center justify-between px-1">
        {hoveredPoint ? (
          <div className="flex items-center gap-3 text-slate-800">
            <span className="font-semibold text-blue-600 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {hoveredPoint.displayDate || hoveredPoint.date}
            </span>
            <span>Quantity: <strong className="font-mono">{hoveredPoint.quantity} units</strong></span>
            <span>Sales: <strong className="font-mono text-emerald-600">${hoveredPoint.sales.toFixed(2)}</strong></span>
            <span>Transactions: <strong className="font-mono">{hoveredPoint.transactions}</strong></span>
          </div>
        ) : (
          <span className="text-slate-400 italic">Hover over markers for day breakdown</span>
        )}
      </div>

      {/* SVG Chart */}
      <div className="relative w-full flex-1 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-[220px] overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = paddingY + chartH * (1 - pct);
            const val = Math.round(maxQty * 1.1 * pct);
            return (
              <g key={pct}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Filled Area */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points / Markers */}
          {points.map((pt, i) => {
            const isHovered = hoveredPoint?.date === pt.data.date;
            const isPeak = pt.data.date === highestDay.date;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredPoint(pt.data)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              >
                {/* Large transparent hitbox for easy hovering */}
                <circle cx={pt.x} cy={pt.y} r="8" fill="transparent" />

                {/* Visible marker */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : isPeak ? 4.5 : 2.5}
                  fill={isPeak ? '#059669' : isHovered ? '#1d4ed8' : '#3b82f6'}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all"
                />
              </g>
            );
          })}

          {/* X axis baseline */}
          <line
            x1={paddingX}
            y1={svgHeight - paddingY}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingY}
            stroke="#cbd5e1"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Date labels under chart */}
      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1 px-4">
        <span>{sortedData[0]?.displayDate || sortedData[0]?.date}</span>
        <span>{sortedData[Math.floor(sortedData.length / 2)]?.displayDate || sortedData[Math.floor(sortedData.length / 2)]?.date}</span>
        <span>{sortedData[sortedData.length - 1]?.displayDate || sortedData[sortedData.length - 1]?.date}</span>
      </div>
    </div>
  );
};
