import { model, Schema, Document } from 'mongoose';

export interface ITag extends Document {
    name: string;
    slug: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let TagSchema = new Schema({ 
    name: {
		type: String,
        required: true
    },
	slug: {
		type: String,
		required: true
    },
    description: {
		type: String
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
}, {collection: 'tags'});

export default model<ITag>('Tag', TagSchema);