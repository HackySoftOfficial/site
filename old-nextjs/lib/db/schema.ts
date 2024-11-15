export interface Order {
  id: string;
  productId: string;
  amount: number;
  cryptoType: string;
  cryptoAddress: string;
  status: 'pending' | 'completed' | 'failed';
  email?: string;
  transactionHash?: string;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: number;
}