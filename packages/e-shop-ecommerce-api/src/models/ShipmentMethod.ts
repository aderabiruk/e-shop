import { model, Schema, Document } from 'mongoose';

export interface ShipmentMethod extends Document {
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let ShipmentMethodSchema = new Schema({ 
    name: {
        type: String,
		unique: true,
        index: true,
        trim: true,
        sparse: true,
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
}, {collection: 'shipment_methods'});

export default model<ShipmentMethod>('ShipmentMethod', ShipmentMethodSchema);