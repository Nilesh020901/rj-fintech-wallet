export interface Transaction {
  id: number;
  amount: number;
  status: string;
  created_at: string;
  user: string;
}

export interface Wallet {
  id: number;
  balance: number;
}