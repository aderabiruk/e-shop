import { Schema } from 'mongoose';

export interface ProductDimensionType {
    width: number;
    length: number;
    height: number;
};

export const ProductDimensionSchema = new Schema({
    width: {
        type: Number,
        default: 0
    },
    length: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    }
});