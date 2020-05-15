import { model, Schema, Document } from 'mongoose';

import Messages from '../errors/Messages';

export interface IDiscount extends Document {
    name: string;
    code: string;
    percentage: number;
    start_date: Date;
    end_date: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let DiscountSchema = new Schema({ 
    name: {
		type: String,
        required: true
    },
    code: {
		type: String,
        required: true
    },
    percentage: {
		type: Number,
        required: true,
        validate: {
            validator: function(value: any) {
                return value ? value > 0 && value <= 100 : false;
            },
            message: Messages.DISCOUNT_INVALID_PERCENTAGE
        }
    },
    start_date: {
		type: Date,
		required: true
    },
    end_date: {
		type: Date,
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
}, {collection: 'discounts'});

export default model<IDiscount>('Discount', DiscountSchema);