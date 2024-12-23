import express from 'express';
import PaymentController from './PaymentController';

const router = express.Router();

router.post('/process-payment', PaymentController.processPayment);
router.post('/refund-payment',  PaymentController.refundPayment);
router.post('/webhook',  PaymentController.webhook);

export default router;