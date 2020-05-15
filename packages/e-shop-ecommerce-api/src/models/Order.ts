import { model, Schema, Document } from 'mongoose';

import Messages from '../errors/Messages';
import { AddressSchema, IAddress } from './Location';
import { OrderPriceSchema, IOrderPrice } from './Price';
import { OrderStatus } from '../../src/utilities/constants/General';

export interface IOrder extends Document {
    number: string;
    customer_id: string;
    billing_address: IAddress;
    shipping_address: IAddress;
    status: string;
    payment_method_id: string;
    shipping_method_id: string;
    items: IOrderItem[];
    price: IOrderPrice;
    note: string;
    completed_at: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

export interface IOrderItem {
    product: string;
    quantity: number;
};

export const OrderItemSchema = new Schema({
    product: {
		type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
		required: true
    }
});

let OrderSchema = new Schema({ 
    number: {
		type: String,
        required: true
    },
    customer_id: {
		type: Schema.Types.ObjectId,
        ref: 'Customer',
    },
    billing_address: {
		type: AddressSchema,
        required: true
    },
    shipping_address: {
		type: AddressSchema,
        required: true
    },
    status: {
        enum: [
            OrderStatus.PENDING,
            OrderStatus.PROCESSING,
            OrderStatus.READY_FOR_SHIPMENT,
            OrderStatus.IN_TRANSIT,
            OrderStatus.COMPLETED,
            OrderStatus.CANCELLED,
            OrderStatus.REJECTED,
            OrderStatus.REFUNDED
        ],
		type: String,
		required: true
    },
    payment_method_id: {
		type: Schema.Types.ObjectId,
        ref: 'PaymentMethod',
    },
    shipping_method_id: {
		type: Schema.Types.ObjectId,
        ref: 'ShipmentMethod',
    },
    items: {
        type: [OrderItemSchema],
        required: true,
        validate: {
            validator: function(value: any) {
                return value ? value.length > 0 : false;
            },
            message: Messages.ORDER_ITEMS_REQUIRED
        }
    },
    price: {
        type: OrderPriceSchema,
        required: true
    },
    note: {
        type: String
    },
    completed_at: {
		type: Date,
		default: null
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
}, {collection: 'orders'});

export default model<IOrder>('Order', OrderSchema);