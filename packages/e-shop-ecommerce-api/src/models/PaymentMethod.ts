import { model, Schema, Document } from 'mongoose';

export interface PaymentMethod extends Document {
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let PaymentMethodSchema = new Schema({ 
    name: {
        type: String,
		unique: true,
        index: true,
        trim: true,
        sparse: true,
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
}, {collection: 'payment_methods'});

export default model<PaymentMethod>('PaymentMethod', PaymentMethodSchema);