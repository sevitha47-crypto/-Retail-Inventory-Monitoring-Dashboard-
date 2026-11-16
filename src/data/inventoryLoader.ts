import { Transaction } from '../types/inventory';

export function parseCSV(csvText: string): Transaction[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const transactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV line splitting taking care of simple commas
    const cols = line.split(',').map((c) => c.trim());
    if (cols.length < 5) continue;

    const invoiceId = cols[0] || `INV-${i}`;
    const branch = cols[1] || 'Unknown';
    const city = cols[2] || 'Unknown';
    const customerType = cols[3] || 'Normal';
    const gender = cols[4] || 'Other';
    const productLine = cols[5] || 'General';
    const unitPrice = parseFloat(cols[6]) || 0;
    const quantity = parseInt(cols[7], 10) || 0;
    const tax5 = parseFloat(cols[8]) || 0;
    const sales = parseFloat(cols[9]) || unitPrice * quantity * 1.05;

    // Standardize date to YYYY-MM-DD
    const rawDate = cols[10] || '';
    let formattedDate = rawDate;
    if (rawDate.includes('/')) {
      const parts = rawDate.split('/');
      if (parts.length === 3) {
        const m = parts[0].padStart(2, '0');
        const d = parts[1].padStart(2, '0');
        const y = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
        formattedDate = `${y}-${m}-${d}`;
      }
    }

    const time = cols[11] || '';
    const payment = cols[12] || 'Cash';
    const cogs = parseFloat(cols[13]) || unitPrice * quantity;
    const grossMarginPercentage = parseFloat(cols[14]) || 4.7619;
    const grossIncome = parseFloat(cols[15]) || tax5;
    const rating = parseFloat(cols[16]) || 5.0;

    transactions.push({
      invoiceId,
      branch,
      city,
      customerType,
      gender,
      productLine,
      unitPrice,
      quantity,
      tax5,
      sales,
      date: formattedDate,
      time,
      payment,
      cogs,
      grossMarginPercentage,
      grossIncome,
      rating,
    });
  }

  return transactions;
}

export function exportToCSV(transactions: Transaction[], filename = 'filtered_inventory_data.csv'): void {
  const headers = [
    'Invoice ID',
    'Branch',
    'City',
    'Customer type',
    'Gender',
    'Product line',
    'Unit price',
    'Quantity',
    'Tax 5%',
    'Sales',
    'Date',
    'Time',
    'Payment',
    'cogs',
    'gross margin percentage',
    'gross income',
    'Rating',
  ];

  const rows = transactions.map((t) => [
    t.invoiceId,
    `"${t.branch}"`,
    `"${t.city}"`,
    `"${t.customerType}"`,
    `"${t.gender}"`,
    `"${t.productLine}"`,
    t.unitPrice.toFixed(2),
    t.quantity,
    t.tax5.toFixed(4),
    t.sales.toFixed(4),
    t.date,
    `"${t.time}"`,
    `"${t.payment}"`,
    t.cogs.toFixed(2),
    t.grossMarginPercentage.toFixed(4),
    t.grossIncome.toFixed(4),
    t.rating.toFixed(1),
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
