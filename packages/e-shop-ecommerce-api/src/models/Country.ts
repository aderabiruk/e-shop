import { model, Schema, Document } from 'mongoose';

export interface ICountry extends Document {
    name: string;
    code: string;
    flag: string;
    currency_name: string;
    currency_code: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let CountrySchema = new Schema({ 
    name: {
		type: String,
        required: true
    },
	code: {
		type: String,
		required: true
    },
    flag: {
		type: String,
		required: true
    },
    currency_name: {
		type: String,
		required: true
    },
    currency_code: {
		type: String,
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
}, {collection: 'countries'});

export default model<ICountry>('Country', CountrySchema);