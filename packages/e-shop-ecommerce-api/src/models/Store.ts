import { model, Schema, Document } from 'mongoose';
import { ILocation, PointSchema } from './Location';

export interface IStore extends Document {
    name: string;
    email: string;
    phone_number: string;
    city: string;
    address: string;
    location: ILocation;
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
    city: {
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

export default model<IStore>('Store', StoreSchema);