export interface Product {
  id?: number;
  name: string;
  description?: string;
  price_cents: number;
  category_id?: number;
  sku?: string;
  barcode?: string;
  tax_rate_cents: number;
  stock_quantity?: number;
  created_at: number;
  updated_at: number;
}

export interface Category {
  id?: number;
  name: string;
  description?: string;
  parent_id?: number;
  created_at: number;
  updated_at: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id?: number;
  transaction_id: string;
  provider_transaction_id?: string;
  amount_cents: number;
  currency: string;
  payment_provider: string;
  payment_method: string;
  status: TransactionStatus;
  terminal_id?: string;
  customer_id?: number;
  tax_cents: number;
  discount_cents: number;
  subtotal_cents: number;
  receipt_data?: string;
  cashier_id?: string;
  created_at: number;
  updated_at: number;
}

export type TransactionStatus = 
  | 'pending'
  | 'authorized'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

export interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: number;
  updated_at: number;
}
