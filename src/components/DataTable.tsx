import React, { useState, useMemo } from 'react';
import { Download, Search, ChevronLeft, ChevronRight, FileSpreadsheet, ArrowUpDown, Copy, Check } from 'lucide-react';
import { Transaction } from '../types/inventory';
import { exportToCSV } from '../data/inventoryLoader';

interface DataTableProps {
  data: Transaction[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [copied, setCopied] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter((t) => {
      const match =
        t.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.productLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.payment.toLowerCase().includes(searchTerm.toLowerCase());
      return match;
    });
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleDownload = () => {
    exportToCSV(data, 'SuperMarket_Filtered_Analysis.csv');
  };

  const handleCopy = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      {/* Header and Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-800 text-base flex items-center gap-2">
            <span>⬇</span> Download & Explore Filtered Data
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Full transactional dataset matching your active sidebar filter selections
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied JSON!' : 'Copy Data'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV ({data.length} rows)</span>
          </button>
        </div>
      </div>

      {/* Search and Table Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice, product, branch..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border border-slate-200 rounded-md px-2 py-1 text-xs bg-white text-slate-700"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th onClick={() => toggleSort('invoiceId')} className="px-3 py-2.5 cursor-pointer hover:text-indigo-600">
                <span className="flex items-center gap-1">Invoice ID <ArrowUpDown className="w-3 h-3 opacity-50" /></span>
              </th>
              <th onClick={() => toggleSort('date')} className="px-3 py-2.5 cursor-pointer hover:text-indigo-600">
                <span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3 opacity-50" /></span>
              </th>
              <th onClick={() => toggleSort('branch')} className="px-3 py-2.5 cursor-pointer hover:text-indigo-600">
                <span className="flex items-center gap-1">Branch <ArrowUpDown className="w-3 h-3 opacity-50" /></span>
              </th>
              <th onClick={() => toggleSort('city')} className="px-3 py-2.5 cursor-pointer hover:text-indigo-600">
                <span className="flex items-center gap-1">City <ArrowUpDown className="w-3 h-3 opacity-50" /></span>
              </th>
              <th onClick={() => toggleSort('productLine')} className="px-3 py-2.5 cursor-pointer hover:text-indigo-600">
                <span className="flex items-center gap-1">Product Line <ArrowUpDown className="w-3 h-3 opacity-50" /></span>
              </th>
              <th onClick={() => toggleSort('unitPrice')} className="px-3 py-2.5 text-right cursor-pointer hover:text-indigo-600">
                <span className="flex items-center justify-end gap-1">Price <ArrowUpDown className="w-3 h-3 opacity-50" /></span>
              </th>
              <th onClick={() => toggleSort('quantity')} className="px-3 py-2.5 text-center cursor-pointer hover:text-indigo-600">
                <span className="flex items-center justify-center gap-1">Qty <ArrowUpDown className="w-3 h-3 opacity-50" /></span>
              </th>
              <th onClick={() => toggleSort('sales')} className="px-3 py-2.5 text-right cursor-pointer hover:text-indigo-600">
                <span className="flex items-center justify-end gap-1">Sales ($) <ArrowUpDown className="w-3 h-3 opacity-50" /></span>
              </th>
              <th className="px-3 py-2.5 text-center">Customer</th>
              <th className="px-3 py-2.5 text-center">Payment</th>
              <th onClick={() => toggleSort('rating')} className="px-3 py-2.5 text-right cursor-pointer hover:text-indigo-600">
                <span className="flex items-center justify-end gap-1">Rating <ArrowUpDown className="w-3 h-3 opacity-50" /></span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr key={row.invoiceId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2.5 font-mono font-medium text-slate-800">{row.invoiceId}</td>
                  <td className="px-3 py-2.5 text-slate-600 font-mono">{row.date}</td>
                  <td className="px-3 py-2.5 text-slate-800 font-semibold">{row.branch}</td>
                  <td className="px-3 py-2.5 text-slate-600">{row.city}</td>
                  <td className="px-3 py-2.5 font-medium text-slate-900">{row.productLine}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-600">${row.unitPrice.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono font-bold">
                      {row.quantity}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">${row.sales.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      row.customerType === 'Member' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {row.customerType}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-slate-500">{row.payment}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-semibold text-amber-600">⭐ {row.rating.toFixed(1)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-slate-400">
                  No records match your filter criteria or search keyword.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 pt-1">
        <span>
          Showing <strong>{sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
          <strong>{Math.min(currentPage * pageSize, sortedData.length)}</strong> of{' '}
          <strong>{sortedData.length}</strong> records
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
