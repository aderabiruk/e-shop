import { model, Schema, Document } from 'mongoose';
import { ILocation, PointSchema } from './Location';

export interface ICity extends Document {
    name: string;
    code: string;
    country: string;
    location: ILocation;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let CitySchema = new Schema({ 
    name: {
		type: String,
        required: true
    },
	code: {
		type: String,
		required: true
    },
    country: {
		type: Schema.Types.ObjectId,
        ref: 'Country',
        required: true,
    },
    location: {
		type: PointSchema,
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
}, {collection: 'cities'});

export default model<ICity>('City', CitySchema);