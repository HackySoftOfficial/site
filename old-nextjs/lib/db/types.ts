/// <reference types="@cloudflare/workers-types" />

export interface Order {
  id: string;
  productId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
  updatedAt: number;
  customer: {
    name: string;
    email: string;
  };
  product: {
    name: string;
    price: number;
  };
  coinbaseChargeId?: string;
  contactMethod?: string;
  contactValue?: string;
  transactionHash?: string;
  metadata?: {
    serviceType?: string;
    projectSize?: string;
    teamSize?: string;
    duration?: string;
  };
} 