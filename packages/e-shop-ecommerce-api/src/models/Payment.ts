import { model, Schema, Document } from 'mongoose';
import { PaymentStatus } from '../utilities/constants/General';

export interface IPayment extends Document {
    order: string;
    customer: string;
    method: string;
    status: string;
    price: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let PaymentSchema = new Schema({ 
    order: {
		type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    customer: {
		type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    method: {
		type: Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true
    },
    status: {
        enum: [
            PaymentStatus.PENDING,
            PaymentStatus.COMPLETED,
            PaymentStatus.CANCELLED,
            PaymentStatus.REJECTED,
            PaymentStatus.DECLINED
        ],
		type: String,
		required: true
    },
    price: {
        type: Number,
        required: true
    },
	created_at: {
		type: Date,
		default: Date.now,
    },
    updated_at: {
		type: Date,
		default: Date.now,
	},
	deleted_at: {
		type: Date,
		default: null
	}
}, {collection: 'payments'});

export default model<IPayment>('Payment', PaymentSchema);