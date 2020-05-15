import mongoose from "mongoose";

import { createShipment } from "../Generator";
import ShipmentDAL from "../../src/dals/Shipment.dal";
import Shipment, { IShipment } from "../../src/models/Shipment";
import { PaymentStatus, OrderStatus, ShipmentStatus } from "../../src/utilities/constants/General";

const app = require("../../src/app");

const OrderID = mongoose.Types.ObjectId().toHexString();
const ShipmentMethodID = mongoose.Types.ObjectId().toHexString();

describe("Payment.dal", () => {
    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await ShipmentDAL.create(null, null, null, null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "order",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "method",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "status",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "tracking_code",
                    })
                ]));
            }
        });

        it("Should return error if status is invalid!", async () => {
            try {
                await ShipmentDAL.create(mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), "INVALID", "TRACKING_CODE");
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "status",
                    })
                ]));
            }
        });

        it("Should create shipment!", async () => {
            let shipment = await ShipmentDAL.create(OrderID, ShipmentMethodID, ShipmentStatus.PENDING, "TRACKING_CODE");
            expect(shipment.order.toString()).toBe(OrderID.toString());
            expect(shipment.method.toString()).toBe(ShipmentMethodID.toString());
            expect(shipment.status).toBe(ShipmentStatus.PENDING);
            expect(shipment.tracking_code).toBe("TRACKING_CODE");
        });
    });

    describe("findMany", () => {
        it("Should return shipment", async () => {
            await createShipment(OrderID, ShipmentMethodID, ShipmentStatus.PENDING, "TRACKING_CODE").save();

            let shipment: IShipment[] = await ShipmentDAL.findMany({});
            expect(shipment.length).toBeGreaterThan(0);
        });
    });

    describe("findOne", () => {
        it("Should return null if shipment doesn't exist", async () => {
            let fetchedPayment: IShipment = await ShipmentDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(fetchedPayment).toBeNull();
        });

        it("Should return shipment", async () => {
            let shipment: IShipment = await createShipment(OrderID, ShipmentMethodID, ShipmentStatus.PENDING, "TRACKING_CODE").save();

            let fetchedShipment: IShipment = await ShipmentDAL.findOne({ _id: shipment._id.toString() });
            expect(fetchedShipment.order.toString()).toBe(OrderID.toString());
            expect(fetchedShipment.method.toString()).toBe(ShipmentMethodID.toString());
            expect(fetchedShipment.status).toBe(ShipmentStatus.PENDING);
            expect(fetchedShipment.tracking_code).toBe("TRACKING_CODE");
        });
    });

    describe("update", () => {
        it("Should return null if shipment doesn't exist", async () => {
            let shipment: IShipment = await ShipmentDAL.update(null, {});
            expect(shipment).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let shipment: IShipment = await createShipment(OrderID, ShipmentMethodID, ShipmentStatus.PENDING, "TRACKING_CODE").save();

            let updatedShipment: IShipment = await ShipmentDAL.update(shipment, {});
            expect(updatedShipment.order.toString()).toBe(OrderID.toString());
            expect(updatedShipment.method.toString()).toBe(ShipmentMethodID.toString());
            expect(updatedShipment.status).toBe(ShipmentStatus.PENDING);
            expect(updatedShipment.tracking_code).toBe("TRACKING_CODE");
        });

        it("Shouldn't return error if status is invalid", async () => {
            let shipment: IShipment = await createShipment(OrderID, ShipmentMethodID, ShipmentStatus.PENDING, "TRACKING_CODE").save();
            
            try {
                let updatedShipment: IShipment = await ShipmentDAL.update(shipment, { status: "INVALID" });
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "status",
                    })
                ]));
            }
        });

        it("Should update shipment", async () => {
            let shipment: IShipment = await createShipment(OrderID, ShipmentMethodID, ShipmentStatus.PENDING, "TRACKING_CODE").save();

            let updatedShipment: IShipment = await ShipmentDAL.update(shipment, { tracking_code: 'NEW_CODE' });
            expect(updatedShipment.order.toString()).toBe(OrderID.toString());
            expect(updatedShipment.method.toString()).toBe(ShipmentMethodID.toString());
            expect(updatedShipment.status).toBe(ShipmentStatus.PENDING);
            expect(updatedShipment.tracking_code).toBe("NEW_CODE");
        });

    
    });

    describe("deleteHard", () => {
        it("Should return 0 deletedCount if shipment doesn't exist", async () => {
            let result: any = await ShipmentDAL.deleteHard({ _id: mongoose.Types.ObjectId().toString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete shipment if it exists", async () => {
            let shipment: IShipment = await createShipment(OrderID, ShipmentMethodID, ShipmentStatus.PENDING, "TRACKING_CODE").save();

            let result: any = await ShipmentDAL.deleteHard({ _id: shipment._id.toString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null shipment is passed", async () => {
            let shipment: IShipment = await ShipmentDAL.deleteSoft(null);
            expect(shipment).toBeNull();
        });

        it("Should soft delete shipment if it exists", async () => {
            let shipment: IShipment = await createShipment(OrderID, ShipmentMethodID, ShipmentStatus.PENDING, "TRACKING_CODE").save();

            let deletedShipment: IShipment = await ShipmentDAL.deleteSoft(shipment);
            expect(deletedShipment.deleted_at).toBeTruthy();
        });
    });

    afterEach(async () => {
        await Shipment.deleteMany({ order: OrderID.toString() });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

});