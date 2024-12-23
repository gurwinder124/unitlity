// src/PaymentGatewayFactory.ts
import { PaymentGateway } from './interfaces/PaymentGateway';
import { StripePaymentGateway } from './gateways/StripePaymentGateway';
import { PaypalPaymentGateway } from './gateways/PaypalPaymentGateway';

export class PaymentGatewayFactory {
  static createPaymentGateway(type: 'stripe' | 'paypal', config: any): PaymentGateway {
    switch (type) {
      case 'stripe':
        return new StripePaymentGateway(config.apiKey);
      case 'paypal':
        return new PaypalPaymentGateway();
      default:
        throw new Error('Invalid payment gateway type');
    }
  }
}
