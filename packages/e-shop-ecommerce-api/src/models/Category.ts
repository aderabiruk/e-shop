import { model, Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    parent: string;
    image_url: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let CategorySchema = new Schema({ 
    name: {
		type: String,
        unique: true,
        index: true,
        trim: true,
        sparse: true,
        required: true
    },
	slug: {
		type: String,
		required: true
    },
    image_url: {
        type: String,
        default: null
    },
    description: {
		type: String
    },
    parent: {
		type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null
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
}, {collection: 'categories'});


export default model<ICategory>('Category', CategorySchema);