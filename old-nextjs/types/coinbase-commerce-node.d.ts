declare module 'coinbase-commerce-node' {
  export class Client {
    static init(apiKey: string): void;
  }

  interface ChargeData {
    id: string;
    hosted_url: string;
    [key: string]: any;
  }

  interface CreateChargeParams {
    name: string;
    description: string;
    pricing_type: 'fixed_price' | 'no_price';
    local_price: {
      amount: string;
      currency: string;
    };
    metadata: {
      [key: string]: string;
    };
    redirect_url?: string;
    cancel_url?: string;
  }

  export namespace resources {
    export class Charge {
      static create(params: CreateChargeParams): Promise<ChargeData>;
    }
  }
} 