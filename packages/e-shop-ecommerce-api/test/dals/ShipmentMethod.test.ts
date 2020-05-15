import mongoose from 'mongoose';

import ShipmentMethodDAL from '../../src/dals/ShipmentMethod.dal';
import ShipmentMethod, { IShipmentMethod } from '../../src/models/ShipmentMethod';

import { createShipmentMethod } from '../Generator';

const app = require("../../src/app");

describe("ShipmentMethod.dal", () => {
        
    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await ShipmentMethodDAL.create(null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                    })
                ]));
            }
        });

        it("Should return error if shipment method already exists!", async () => {
            await createShipmentMethod("test-shipment-method").save();

            try {
                await ShipmentMethodDAL.create("test-shipment-method");
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                    })
                ]));
            }
        });

        it("Should create shipment method!", async () => {
            let shipment_method = await ShipmentMethodDAL.create("test-shipment-method");
            expect(shipment_method.name).toBe("test-shipment-method");
        });
    });

    describe("findMany", () => {
        it("Should return shipment methods", async () => {
            await createShipmentMethod("test-shipment-method").save();

            let shipment_methods: IShipmentMethod[] = await ShipmentMethodDAL.findMany({});
            expect(shipment_methods.length).toBeGreaterThan(0);
        });
    });

    describe("findOne", () => {
        it("Should return null if shipment method doesn't exist", async () => {
            let shipment_method: IShipmentMethod = await ShipmentMethodDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(shipment_method).toBeNull();
        });

        it("Should return shipment method", async () => {
            let shipment_method = await createShipmentMethod("test-shipment-method").save();

            let fetchedShipmentMethod: IShipmentMethod = await ShipmentMethodDAL.findOne({ _id: shipment_method._id.toString() });
            expect(fetchedShipmentMethod).not.toBeNull();
            expect(fetchedShipmentMethod.name).toBe("test-shipment-method");
        });
    });

    describe("update", () => {
        it("Should return null if shipment method doesn't exist", async () => {
            let shipment_method: IShipmentMethod = await ShipmentMethodDAL.update(null, {});
            expect(shipment_method).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let shipment_method = await createShipmentMethod("test-shipment-method").save();

            let updatedShipmentMethod: IShipmentMethod = await ShipmentMethodDAL.update(shipment_method, {});
            expect(updatedShipmentMethod).not.toBeNull();
            expect(updatedShipmentMethod.name).toBe("test-shipment-method");
        });

        it("Should return error if shipment name already exists", async () => {
            let shipment_method1 = await createShipmentMethod("test-shipment-method").save();
            let shipment_method2 = await createShipmentMethod("test-shipment-method-1").save();

            try {
                let updatedShipmentMethod: IShipmentMethod = await ShipmentMethodDAL.update(shipment_method1, {name: "test-shipment-method-1"});
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                    })
                ]));
            }
        
        });

        it("Should update shipment method name", async () => {
            let shipment_method = await createShipmentMethod("test-shipment-method").save();

            let updatedShipmentMethod: IShipmentMethod = await ShipmentMethodDAL.update(shipment_method, { name: "test-shipment-method-1" });
            expect(updatedShipmentMethod).not.toBeNull();
            expect(updatedShipmentMethod.name).toBe("test-shipment-method-1");
        });
    });

    describe("deleteHard", () => {
        it("Should return 0 deletedCount if shipment method doesn't exist", async () => {
            let result: any = await ShipmentMethodDAL.deleteHard({ _id: mongoose.Types.ObjectId().toString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete shipment method if it exists", async () => {
            let shipment_method = await createShipmentMethod("test-shipment-method").save();

            let result: any = await ShipmentMethodDAL.deleteHard({ _id: shipment_method._id.toString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null shipment method is passed", async () => {
            let shipment_method: IShipmentMethod = await ShipmentMethodDAL.deleteSoft(null);
            expect(shipment_method).toBeNull();
        });

        it("Should soft delete shipment method if it exists", async () => {
            let shipment_method = await createShipmentMethod("test-shipment-method").save();

            let deletedShipmentMethod: IShipmentMethod = await ShipmentMethodDAL.deleteSoft(shipment_method);
            expect(deletedShipmentMethod).not.toBeNull();
            expect(deletedShipmentMethod.name).toBe("test-shipment-method");
            expect(deletedShipmentMethod.deleted_at).toBeTruthy();
        });
    });

    afterEach(async () => {
        await ShipmentMethod.deleteMany({ name: "test-shipment-method" });
        await ShipmentMethod.deleteMany({ name: "test-shipment-method-1" });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

});