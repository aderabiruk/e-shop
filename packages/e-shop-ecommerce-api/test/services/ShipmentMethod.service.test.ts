import mongoose from 'mongoose';

import { createShipmentMethod } from '../Generator';
import Messages from '../../src/errors/Messages';
import ShipmentMethod, { IShipmentMethod } from '../../src/models/ShipmentMethod';
import ShipmentMethodService from '../../src/services/ShipmentMethod.service';
import { IPaginationResponse } from '../../src/utilities/adapters/Pagination';

const app = require("../../src/app");

describe("ShipmentMethod.service", () => {
        
    describe("create", () => {
        it("Should return validation error if name is not provided", async () => {
            try {
                await ShipmentMethodService.create(null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                        message: Messages.SHIPMENT_METHOD_NAME_REQUIRED
                    })
                ]));
            }
        });

        it("Should create shipment method ", async () => {
            let shipmentMethod = await ShipmentMethodService.create("test-shipment-method");
            expect(shipmentMethod.name).toBe("test-shipment-method");
        });

    });

    describe("findMany", () => {
        it("Should return shipment methods", async () => {
            await createShipmentMethod("test-shipment-method").save();

            let response: IPaginationResponse = await ShipmentMethodService.findAll();
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
        });
    });

    describe("findByID", () => {
        it("Should return null if id is invalid", async () => {
            let shipmentMethod: IShipmentMethod = await ShipmentMethodService.findByID("INVALID-ID");
            expect(shipmentMethod).toBeNull();
        });

        it("Should return null if shipment method doesn't exist", async () => {
            let shipmentMethod: IShipmentMethod = await ShipmentMethodService.findByID(mongoose.Types.ObjectId().toHexString());
            expect(shipmentMethod).toBeNull();
        });

        it("Should return shipment method if it exist", async () => {
            let shipmentMethod: IShipmentMethod = await createShipmentMethod("test-shipment-method").save();

            let fetchedShipmentMethod: IShipmentMethod = await ShipmentMethodService.findByID(shipmentMethod._id);
            expect(fetchedShipmentMethod).not.toBeNull();
            expect(fetchedShipmentMethod.name).toBe("test-shipment-method");
        });
    });

    describe("update", () => {
        it("Should return null if shipment method doesn't exist", async () => {
            try {
                let shipmentMethod: IShipmentMethod = await ShipmentMethodService.update(null, {});
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(404);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    Messages.SHIPMENT_METHOD_NOT_FOUND
                ]));
            }
        });

        it("Shouldn't update if payload is empty", async () => {
            let ShipmentMethod: IShipmentMethod = await createShipmentMethod("test-shipment-method").save();

            let updatedShipmentMethod: IShipmentMethod = await ShipmentMethodService.update(ShipmentMethod._id, {});
            expect(updatedShipmentMethod).not.toBeNull();
            expect(updatedShipmentMethod.name).toBe("test-shipment-method");
        });

        it("Shouldn update shipment method description", async () => {
            let shipmentMethod: IShipmentMethod = await createShipmentMethod("test-shipment-method").save();

            let updatedShipmentMethod: IShipmentMethod = await ShipmentMethodService.update(shipmentMethod._id, { name: 'test-shipment-method-2' });
            expect(updatedShipmentMethod).not.toBeNull();
            expect(updatedShipmentMethod.name).toBe("test-shipment-method-2");
        });
    });

    afterEach(async () => {
        await ShipmentMethod.deleteMany({ name: "test-shipment-method"});
        await ShipmentMethod.deleteMany({ name: "test-shipment-method-2"});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

});