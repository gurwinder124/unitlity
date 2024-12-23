import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

// 1. Create an interface representing a document in MongoDB.
export enum STATUS {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAIL = 'fail',
  }
export interface IPaymentHistory extends Document {
  orderId: ObjectId;
  paymentStatus: string;
  paymentGateway: string
}

const paymentHistorySchema: Schema = new Schema<IPaymentHistory>(
    {
        orderId: { type: Schema.Types.ObjectId, required: true },
        paymentStatus: { type: String, required: true, default: STATUS.PENDING },
        paymentGateway: { type: String, required: true },
    },
    { timestamps: true, versionKey: false }
);

  export default mongoose.model<IPaymentHistory>('paymentHistory', paymentHistorySchema);