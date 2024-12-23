// src/interfaces/PaymentGateway.ts
export interface PaymentGateway {
    initialize(params: object): Promise<void>;
    processPayment(data: object): Promise<any>;
    refundPayment(transactionId: string, amount?: number): Promise<boolean>;
  }
  