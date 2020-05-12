import { model, Schema, Document } from 'mongoose';
import { LocationType, PointSchema } from './Location';

export interface City extends Document {
    name: string;
    code: string;
    country_id: string;
    location: LocationType;
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
    country_id: {
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

export default model<City>('City', CitySchema);