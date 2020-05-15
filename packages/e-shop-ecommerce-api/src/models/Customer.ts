import { model, Schema, Document } from 'mongoose';

import { Gender } from '../utilities/constants/General';

export interface ICustomer extends Document {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: string;
    store_id: string;
    birth_day: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let CustomerSchema = new Schema({ 
    first_name: {
		type: String,
        required: true
    },
    last_name: {
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
    gender: {
        enum: [
            Gender.MALE,
            Gender.FEMALE,
            Gender.OTHER
        ],
		type: String,
		required: true
    },
    store_id: {
		type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    birth_day: {
		type: Date,
		required: true,
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
}, {collection: 'customers'});

export default model<ICustomer>('Customer', CustomerSchema);