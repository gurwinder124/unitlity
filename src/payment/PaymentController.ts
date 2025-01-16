import { Request, Response } from 'express';
import { PaymentGatewayFactory } from './PaymentGatewayFactory';
import { PaymentGateway } from './interfaces/PaymentGateway';
import Stripe from 'stripe';

class PaymentController {
  processPayment = async (req: Request, res: Response) => {
    try {
      const key = process.env.STRIPE_KEY
      
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
        const verifyCoupon = true;
        if(verifyCoupon){
          discount = 5;
        }
      }

      // Todo: Verify the product Id and get the amount from each product  
      let unitAmount = 100;

      // Todo: After verfication 
      

      let config: object = {}
      let params: object = {}
      const totalAmount = unitAmount - discount
      const data = {
        amount: totalAmount,
        currency: currency
      }
      if (gatewayType == "stripe") {
        config = {
          apiKey: key,
        }
        params = {
          email: 'gurwinder111@yopmail.com',
          unitAmount: unitAmount,
          productName: "Iphone",
          description: "Test Product",
          images: "https://stgps.appsndevs.com/digitalplatform/assets/defaultHouse-DCzRO7FB.png",
          metadata: "testing stripe payments"
        }
      }

      const paymentGateway: PaymentGateway = PaymentGatewayFactory.createPaymentGateway(gatewayType, config);

      // Initialize Stripe and PayPal gateways
      await paymentGateway.initialize(params);

      // Process a payment with Stripe
      const paymentSuccess = await paymentGateway.processPayment(data);
      console.log('Stripe Payment Success:');

      if(paymentSuccess){
        return res
        .status(200)
        .json({ status_code: 200, status: true, data: paymentSuccess });
      }

      return res
        .status(500)
        .json({ status_code: 500, status: false, error: "Somthing went Wrong" });
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
    const event = req.body;
    // Type-safe handling of Stripe events
    try {
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('PaymentIntent was successful!', paymentIntent);
          // Define and call a method to handle the successful payment intent
          // handlePaymentIntentSucceeded(paymentIntent);
          break;
        }
        case 'payment_method.attached': {
          const paymentMethod = event.data.object as Stripe.PaymentMethod;
          console.log('PaymentMethod was attached!', paymentMethod);
          // Define and call a method to handle the successful attachment of a PaymentMethod
          // handlePaymentMethodAttached(paymentMethod);
          break;
        }
        // Handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      console.error(`Error processing webhook: ${(err as Error).message}`);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }

  }
}


export default new PaymentController();
