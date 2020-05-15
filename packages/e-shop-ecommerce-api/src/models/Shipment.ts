import { model, Schema, Document } from 'mongoose';
import { ShipmentStatus } from '../utilities/constants/General';

export interface IShipment extends Document {
    order: string;
    method: string;
    status: string;
    tracking_code: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let ShipmentSchema = new Schema({ 
    order: {
		type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    method: {
		type: Schema.Types.ObjectId,
        ref: 'ShipmentMethod',
        required: true
    },
    status: {
        enum: [
            ShipmentStatus.PENDING,
            ShipmentStatus.SHIPPED,
            ShipmentStatus.CANCELLED,
            ShipmentStatus.IN_TRANSIT,
        ],
		type: String,
		required: true
    },
    tracking_code: {
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
}, {collection: 'shipments'});

export default model<IShipment>('Shipment', ShipmentSchema);