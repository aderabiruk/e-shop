import { Schema } from 'mongoose';

export interface LocationType {
    type: string;
    coordinates: any[];
};

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