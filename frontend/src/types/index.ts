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

export interface Department {
  department_id: number;
  department_name: string;
  wallet_id: number;
  balance: number;
}

export interface User {
  id: number;
  name: string;
}
