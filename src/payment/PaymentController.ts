import { Request, Response } from 'express';
import { PaymentGatewayFactory } from './PaymentGatewayFactory';
import { PaymentGateway } from './interfaces/PaymentGateway';


class PaymentController {
  processPayment = async (req: Request, res: Response) => {
    try {
      const { user_id, products, coupon, gatewayType } = req.body;
      const currency = req.body.currency || "usd";
      let discount: number = 0;
      // Add Validation of the Paylode Here
      if (user_id == undefined || gatewayType == undefined) {
        return res
          .status(404)
          .json({ status_code: 404, status: false, message: 'Invalid Input Data' });
      }

      //Verify the coupon here if any
      console.log("coupon ", coupon)
      if(coupon != undefined){
        discount = 5;
      }
      // Verify the product Id and get the amount fro each product  

      

      let config: object = {}
      let params: object = {}
      if (gatewayType == "stripe") {
        config = {
          apiKey: 'sk_test_51QYjMyFg28unwuK3ASGX70LOXjuJSLExcNyvjlT9LrJmlQ7VxdbzgCRdoHImV1biPwLxZ3NphnFPzMr0tc0Y7KsQ00zDWcKYU3',
        }
        params = {
          email: 'gurwinder111@yopmail.com',
          description: "Test Product"
        }
      }

      const paymentGateway: PaymentGateway = PaymentGatewayFactory.createPaymentGateway(gatewayType, config);

      // Initialize Stripe and PayPal gateways
      await paymentGateway.initialize(params);

      // Process a payment with Stripe
      const paymentSuccess = await paymentGateway.processPayment(100, currency, 'tok_visa');
      console.log('Stripe Payment Success:');

      return res
        .status(200)
        .json({ status_code: 200, status: true, data: paymentSuccess });
    } catch (err) {
      return res
        .status(500)
        .json({ status_code: 500, status: false, error: "Somthing went Wrong" });
    }

  };

  refundPayment = async (req: Request, res: Response) => {
    try{

    } catch (err) {
      return res
        .status(500)
        .json({ status_code: 500, status: false, error: "Somthing went Wrong" });
    }
  }

  webhook = async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'];
    const endpointSecret = 'your_webhook_secret';

    try {
      const event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent);
      }

      res.status(200).send('Event received');
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}


export default new PaymentController();
