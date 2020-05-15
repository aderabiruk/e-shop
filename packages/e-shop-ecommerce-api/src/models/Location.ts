import { Schema } from 'mongoose';

export interface IAddress {
    country: string;
    province: string;
    city: string;
    zip_code: string;
    address: string;
};

export interface LocationType {
    type: string;
    coordinates: any[];
};

export const AddressSchema = new Schema({
    country: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zip_code: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

export const PointSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true,
        default: [0, 0]
    }
});

export const PolygonSchema = new Schema({
    type: {
        type: String,
        enum: ['Polygon'],
        required: true
    },
    coordinates: {
        type: [[[Number]]],
        required: true
    }
});