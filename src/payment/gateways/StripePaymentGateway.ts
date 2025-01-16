// src/gateways/StripePaymentGateway.ts
import { PaymentGateway } from '../interfaces/PaymentGateway';
import Stripe from 'stripe';

export class StripePaymentGateway implements PaymentGateway {
  private stripe;
  private price: any;

  constructor(apiKey: string) {
    // this.stripe = new Stripe(apiKey, { apiVersion: '2022-11-15' });
    this.stripe = new Stripe(apiKey);
    console.log('Stripe object created ======== ');
  }

  async initialize(params: any): Promise<void> {
    console.log('Stripe payment gateway initialized======== ');
    if(params?.productName){
      const product = await this.stripe.products.create({
        name: params?.productName, //Product or Service Name
        description: params?.description
      });

      this.price = await this.stripe.prices.create({
        product: product.id,
        unit_amount: params.unitAmount * 100,
        currency: 'usd',
      });
    }
    
  }

  async processPayment(data: object): Promise<any> {
    try {
      const BASE_URL = process.env.FRONTEND_URL;
      
      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price:  this.price.id,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${BASE_URL}/success.html`,
        cancel_url: `${BASE_URL}/cancel.html`,
      });
  
      return session.url
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
