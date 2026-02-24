export interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Trade {
  trade_id: number;
  lender_id: number;
  borrower_id: number | null;
  book_id: number;
  status: 'pending' | 'claimed' | 'cancelled' | 'delivered';
  created_at: string;
}

export interface BookResult {
  title: string;
  author_name: string;
  book_id: number;
  author_id: number;
}
