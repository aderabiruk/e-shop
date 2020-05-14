import { model, Schema, Document } from 'mongoose';

import { Tag } from './Tag';
import { ProductDimensionType, ProductDimensionSchema } from './Metrics';

export interface Product extends Document {
    name: string;
    slug: string;
    price: number;
    quantity: number;
    description: string;
    image_urls: string[];
    category_id: string;
    store_id: string;
    tags: Tag[] | string[];
    weight: number;
    dimension: ProductDimensionType;
    is_visible: boolean;
    is_out_of_stock: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let ProductSchema = new Schema({ 
    name: {
		type: String,
        required: true
    },
	slug: {
		type: String,
		required: true
    },
    price: {
		type: Number,
		required: true
    },
    quantity: {
        type: Number,
		required: true
    },
    description: {
		type: String,
    },
    image_urls: {
		type: [String],
		required: true
    },
    category_id: {
		type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    store_id: {
		type: Schema.Types.ObjectId,
        ref: 'Store',
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }],
    weight: {
        type: Number,
        default: 0
    },
    dimension: {
		type: ProductDimensionSchema,
		required: true
    },
    is_visible: {
        type: Boolean,
        default: true  
    },
    is_out_of_stock: {
        type: Boolean,
        default: false  
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
}, {collection: 'products'});

export default model<Product>('Product', ProductSchema);