import moment from 'moment';
import mongoose from 'mongoose';

import Messages from '../../src/errors/Messages';
import { IAddress } from '../../src/models/Location';
import { IOrderPrice } from '../../src/models/Price';
import Order, { IOrder } from '../../src/models/Order';
import Shipment, { IShipment } from '../../src/models/Shipment';
import ShipmentService from '../../src/services/Shipment.service';
import ShipmentMethod, { IShipmentMethod } from '../../src/models/ShipmentMethod';
import { IPaginationResponse } from '../../src/utilities/adapters/Pagination';
import { createOrder, createShipmentMethod, createShipment } from '../Generator';
import { Gender, OrderStatus, ShipmentStatus } from '../../src/utilities/constants/General';

const app = require("../../src/app");

const address: IAddress = {
    country: "Ethiopia",
    province: "Addis Ababa",
    city: "Addis Ababa",
    zip_code: "0001",
    address: "Menelik Hospital"
};

const price: IOrderPrice = {
    subtotal: 100,
    shipping_price: 10,
    tax: 5,
    total_price: 115
};

describe("Shipment.service", () => {
    let order: IOrder;
    let shipmentMethod: IShipmentMethod;

    beforeAll(async () => {
        shipmentMethod = await createShipmentMethod("test-payment-method").save();
        order = await createOrder("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [{ product: mongoose.Types.ObjectId().toHexString(), quantity: 5 }], price, null).save();
    });

    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await ShipmentService.create(null, null, null, null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "order",
                        message: Messages.SHIPMENT_ORDER_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "method",
                        message: Messages.SHIPMENT_METHOD_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "status",
                        message: Messages.SHIPMENT_STATUS_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "tracking_code",
                        message: Messages.SHIPMENT_TRACKING_CODE_REQUIRED
                    })
                ]));
            }
        });

        it("Should return error if order doesn't exist!", async () => {
            try {
                await ShipmentService.create(mongoose.Types.ObjectId().toHexString(), shipmentMethod._id.toString(), ShipmentStatus.PENDING, "10000")
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "order",
                        message: Messages.ORDER_NOT_FOUND
                    })
                ]));
            }
        });


        it("Should return error if shipment method doesn't exist!", async () => {
            try {
                await ShipmentService.create(order._id.toString(), mongoose.Types.ObjectId().toHexString(), ShipmentStatus.PENDING, "10000")
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "method",
                        message: Messages.SHIPMENT_METHOD_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should create shipments!", async () => {
            let shipment: IShipment = await ShipmentService.create(order._id.toString(), shipmentMethod._id.toString(), ShipmentStatus.PENDING, "10000")
            expect(shipment.order.toString()).toBe(order._id.toString());
            expect(shipment.method.toString()).toBe(shipmentMethod._id.toString());
            expect(shipment.status).toBe(ShipmentStatus.PENDING);
            expect(shipment.tracking_code).toBe("10000");
        });
    });

    describe("findAll", () => {
        it("Should return shipments", async () => {
            await createShipment(order._id.toString(), shipmentMethod._id.toString(), ShipmentStatus.PENDING, "10000").save();

            let response: IPaginationResponse = await ShipmentService.findAll();
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
        });
    });

    describe("findByID", () => {
        it("Should return null if id is invalid", async () => {
            let shipment: IShipment = await ShipmentService.findByID("INVALID-ID");
            expect(shipment).toBeNull();
        });

        it("Should return null if shipment doesn't exist", async () => {
            let shipment: IShipment = await ShipmentService.findByID(mongoose.Types.ObjectId().toHexString());
            expect(shipment).toBeNull();
        });

        it("Should return shipment", async () => {
            let shipment: IShipment = await createShipment(order._id.toString(), shipmentMethod._id.toString(), ShipmentStatus.PENDING, "10000").save();

            let fetchedShipment: IShipment = await ShipmentService.findByID(shipment._id );
            expect(fetchedShipment).not.toBeNull();
            expect(fetchedShipment.order.toString()).toBe(order._id.toString());
            expect(fetchedShipment.method.toString()).toBe(shipmentMethod._id.toString());
            expect(fetchedShipment.status).toBe(ShipmentStatus.PENDING);
            expect(fetchedShipment.tracking_code).toBe("10000");
        });
    });

    describe("update", () => {
        it("Should return error if shipment doesn't exist!", async () => {
            try {
                let shipment: IShipment = await ShipmentService.update("INVALID-ID", {});
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(404);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    Messages.PAYMENT_NOT_FOUND
                ]));
            }
        });

        it("Should return error if order doesn't exist!", async () => {
            let shipment: IShipment = await createShipment(order._id.toString(), shipmentMethod._id.toString(), ShipmentStatus.PENDING, "10000").save();

            try {
                await ShipmentService.update(shipment._id, { order: mongoose.Types.ObjectId().toHexString() });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "order",
                        message: Messages.ORDER_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should return error if method doesn't exist!", async () => {
            let payment: IShipment = await createShipment(order._id.toString(), shipmentMethod._id.toString(), ShipmentStatus.PENDING, "10000").save();

            try {
                await ShipmentService.update(payment._id, { method: mongoose.Types.ObjectId().toHexString() });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "method",
                        message: Messages.SHIPMENT_METHOD_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should return error if status is valid!", async () => {
            let payment: IShipment = await createShipment(order._id.toString(), shipmentMethod._id.toString(), ShipmentStatus.PENDING, "10000").save();

            try {
                await ShipmentService.update(payment._id, { status: "INVALID-STATUS" });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "status",
                    })
                ]));
            }
        });

        it("Shouldn't update shipment if payload is empty!", async () => {
            let shipment: IShipment = await createShipment(order._id.toString(), shipmentMethod._id.toString(), ShipmentStatus.PENDING, "10000").save();

            let updatedShipment = await ShipmentService.update(shipment._id, { });
            expect(updatedShipment.order.toString()).toBe(order._id.toString());
            expect(updatedShipment.method.toString()).toBe(shipmentMethod._id.toString());
            expect(updatedShipment.status).toBe(ShipmentStatus.PENDING);
            expect(updatedShipment.tracking_code).toBe("10000");
        });

        it("Should update price", async () => {
            let shipment: IShipment = await createShipment(order._id.toString(), shipmentMethod._id.toString(), ShipmentStatus.PENDING, "10000").save();

            let updatedShipment = await ShipmentService.update(shipment._id, { tracking_code: "11111" , status: ShipmentStatus.SHIPPED});
            expect(updatedShipment.order.toString()).toBe(order._id.toString());
            expect(updatedShipment.method.toString()).toBe(shipmentMethod._id.toString());
            expect(updatedShipment.status).toBe(ShipmentStatus.SHIPPED);
            expect(updatedShipment.tracking_code).toBe("11111");
        });
    });

    afterEach(async () => {
        await Shipment.deleteMany({ order: order._id.toString() });
    });

    afterAll(async () => {
        await Order.deleteMany({ number: "00000" });
        await ShipmentMethod.deleteMany({ name: "test-payment-method"});

        await mongoose.connection.close();
    });

});