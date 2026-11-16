export interface Transaction {
  invoiceId: string;
  branch: string;
  city: string;
  customerType: 'Member' | 'Normal' | string;
  gender: 'Female' | 'Male' | string;
  productLine: string;
  unitPrice: number;
  quantity: number;
  tax5: number;
  sales: number;
  date: string; // YYYY-MM-DD
  time: string;
  payment: 'Ewallet' | 'Cash' | 'Credit card' | string;
  cogs: number;
  grossMarginPercentage: number;
  grossIncome: number;
  rating: number;
}

export interface ProductDemandSummary {
  productLine: string;
  totalQuantity: number;
  totalSales: number;
  totalTransactions: number;
  avgUnitPrice: number;
  avgRating: number;
  percentageOfTotal: number;
  status: 'critical' | 'warning' | 'healthy' | 'fast';
}

export interface DailyTrendPoint {
  date: string;
  displayDate: string;
  quantity: number;
  sales: number;
  transactions: number;
}

export interface FilterState {
  branches: string[];
  cities: string[];
  productLines: string[];
  customerTypes: string[];
  dateRange: {
    start: string;
    end: string;
  };
  searchTerm: string;
}
