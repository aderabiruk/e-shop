import { model, Schema, Document } from 'mongoose';
import { LocationType, PointSchema } from './Location';

export interface Store extends Document {
    name: string;
    email: string;
    phone_number: string;
    city_id: string;
    address: string;
    location: LocationType;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let StoreSchema = new Schema({ 
    name: {
		type: String,
        required: true
    },
	email: {
		type: String,
		required: true
    },
    phone_number: {
		type: String,
		required: true
    },
    city_id: {
		type: Schema.Types.ObjectId,
        ref: 'City',
        required: true,
    },
    address: {
		type: String,
		required: true
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
}, {collection: 'stories'});

export default model<Store>('Store', StoreSchema);