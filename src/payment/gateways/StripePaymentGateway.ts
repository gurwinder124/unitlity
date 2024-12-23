// src/gateways/StripePaymentGateway.ts
import { PaymentGateway } from '../interfaces/PaymentGateway';
import Stripe from 'stripe';

export class StripePaymentGateway implements PaymentGateway {
  private stripe: Stripe;
  private customer: any;

  constructor(apiKey: string) {
    // this.stripe = new Stripe(apiKey, { apiVersion: '2022-11-15' });
    this.stripe = new Stripe(apiKey);
  }

  async initialize(params: object): Promise<void> {
    // this.customer = await this.stripe.customers.create(params);
    console.log('Stripe payment gateway initialized======== ');
  }

  async processPayment(data: object): Promise<any> {
    try {
      // return this.customer;
      // const charge = await this.stripe.charges.create({
      //   amount: amount * 100, // Convert to smallest currency unit (e.g., cents)
      //   currency,
      // });
      // console.log('Payment processed successfully:---------');
      // return charge
      // return true;
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount * 100, // Amount in smallest currency unit (e.g., cents for USD)
        currency: data.currency,
        payment_method_types: ['card'], // Specify payment methods
      });
      return paymentIntent.client_secret
    } catch (error) {
      console.error('Error processing payment:', error);
      return false;
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<boolean> {
    try {
      const refund = await this.stripe.refunds.create({
        charge: transactionId,
        amount: amount ? amount * 100 : undefined, // Optional partial refund
      });
      console.log('Payment refunded successfully:', refund.id);
      return true;
    } catch (error) {
      console.error('Error processing refund:', error);
      return false;
    }
  }
}
