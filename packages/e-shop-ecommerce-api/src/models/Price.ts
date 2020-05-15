import { Schema } from 'mongoose';

export interface IOrderPrice {
    subtotal: number;
    shipping_price: number;
    tax: number;
    total_price: number;
};

export const OrderPriceSchema = new Schema({
    subtotal: {
        type: Number,
        default: 0
    },
    shipping_price: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    total_price: {
        type: Number,
        default: 0
    }
});