import mongoose from 'mongoose';

import StoreDAL from '../../src/dals/Store.dal';
import Store, { Store as IStore } from '../../src/models/Store';
import { createStore } from '../Generator';

const app = require("../../src/app");

const LATITUDE = 125;
const LONGITUDE = 99;

describe("Store.dal", () => {
        
    describe("create", () => {
        it("Should return error if required fields are not provieded!", async () => {
            try {
                await StoreDAL.create(null, null, null, null ,null, null, null);
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

        it("Should create store if no errors!", async () => {
            let store = await StoreDAL.create("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE);
            
            expect(store.name).toBe("test-store");
            expect(store.email).toBe("test-store-email");
            expect(store.phone_number).toBe("test-store-phone-number");
            expect(store.address).toBe("test-store-address");
            expect(store.location.type).toBe("Point");
            expect(store.location.coordinates).toContainEqual(LATITUDE);
            expect(store.location.coordinates).toContainEqual(LONGITUDE);
        });
    });

    describe("findMany", () => {
        it("Should return stores", async () => {
            await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let stores: IStore[] = await StoreDAL.findMany({});
            expect(stores.length).toBeGreaterThan(0);
        });
    });

    describe("findOne", () => {
        it("Should return null if store doesn't exist", async () => {
            let store: IStore = await StoreDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(store).toBeNull();
        });

        it("Should return store", async () => {
            let store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let fetchedStore: IStore = await StoreDAL.findOne({ _id: store._id });
            expect(fetchedStore).not.toBeNull();
            expect(fetchedStore.name).toBe("test-store");
            expect(fetchedStore.email).toBe("test-store-email");
            expect(fetchedStore.phone_number).toBe("test-store-phone-number");
            expect(fetchedStore.address).toBe("test-store-address");
            expect(fetchedStore.location.type).toBe("Point");
            expect(fetchedStore.location.coordinates).toContainEqual(LATITUDE);
            expect(fetchedStore.location.coordinates).toContainEqual(LONGITUDE);
        });
    });

    describe("update", () => {
        it("Should return null if store doesn't exist", async () => {
            let store: IStore = await StoreDAL.update(null, {});
            expect(store).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let updatedStore: IStore = await StoreDAL.update(store, {});
            expect(updatedStore).not.toBeNull();
            expect(updatedStore.name).toBe("test-store");
            expect(updatedStore.email).toBe("test-store-email");
            expect(updatedStore.phone_number).toBe("test-store-phone-number");
            expect(updatedStore.address).toBe("test-store-address");
            expect(updatedStore.location.type).toBe("Point");
            expect(updatedStore.location.coordinates).toContainEqual(LATITUDE);
            expect(updatedStore.location.coordinates).toContainEqual(LONGITUDE);
        });

        it("Shouldn't update if payload is empty", async () => {
            let store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let updatedStore: IStore = await StoreDAL.update(store, { email: "test-store-email-1" });
            expect(updatedStore).not.toBeNull();
            expect(updatedStore.name).toBe("test-store");
            expect(updatedStore.email).toBe("test-store-email-1");
            expect(updatedStore.phone_number).toBe("test-store-phone-number");
            expect(updatedStore.address).toBe("test-store-address");
            expect(updatedStore.location.type).toBe("Point");
            expect(updatedStore.location.coordinates).toContainEqual(LATITUDE);
            expect(updatedStore.location.coordinates).toContainEqual(LONGITUDE);
        });

        it("Shouldn't update location if only latitude or longitude is provide", async () => {
            let store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let updatedStore: IStore = await StoreDAL.update(store, { latitude: 500 });
            expect(updatedStore).not.toBeNull();
            expect(updatedStore.name).toBe("test-store");
            expect(updatedStore.email).toBe("test-store-email");
            expect(updatedStore.phone_number).toBe("test-store-phone-number");
            expect(updatedStore.address).toBe("test-store-address");
            expect(updatedStore.location.type).toBe("Point");
            expect(updatedStore.location.coordinates).toContainEqual(LATITUDE);
            expect(updatedStore.location.coordinates).toContainEqual(LONGITUDE);
        });

        it("Shouldn't update location if latitude and longitude is not a number", async () => {
            let store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            try {
                let updatedStore: IStore = await StoreDAL.update(store, { latitude: "invalid", longitude: "invalid" });
                fail();
            }
            catch (error) {
                expect(error).toBeTruthy();
            }
        });

        it("Should update location if both latitude and longitude is provide", async () => {
            let store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let updatedStore: IStore = await StoreDAL.update(store, { latitude: 500, longitude: 500 });
            expect(updatedStore).not.toBeNull();
            expect(updatedStore.name).toBe("test-store");
            expect(updatedStore.email).toBe("test-store-email");
            expect(updatedStore.phone_number).toBe("test-store-phone-number");
            expect(updatedStore.address).toBe("test-store-address");
            expect(updatedStore.location.type).toBe("Point");
            expect(updatedStore.location.coordinates).toContainEqual(500);
            expect(updatedStore.location.coordinates).toContainEqual(500);
        });

    });
    
    describe("deleteHard", () => {
        it("Should return 0 deletedCount if store doesn't exist", async () => {
            let result: any = await StoreDAL.deleteHard({ _id: mongoose.Types.ObjectId().toString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete store if it exists", async () => {
            let store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let result: any = await StoreDAL.deleteHard({ _id: store._id.toString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null store is passed", async () => {
            let store: IStore = await StoreDAL.deleteSoft(null);
            expect(store).toBeNull();
        });

        it("Should soft delete store if it exists", async () => {
            let store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let deletedStore: IStore = await StoreDAL.deleteSoft(store);
            expect(deletedStore).not.toBeNull();
            expect(deletedStore.name).toBe("test-store");
            expect(deletedStore.email).toBe("test-store-email");
            expect(deletedStore.phone_number).toBe("test-store-phone-number");
            expect(deletedStore.address).toBe("test-store-address");
            expect(deletedStore.location.type).toBe("Point");
            expect(deletedStore.location.coordinates).toContainEqual(LATITUDE);
            expect(deletedStore.location.coordinates).toContainEqual(LONGITUDE);
        });
    });

    afterEach(async () => {
        await Store.deleteMany({ name: "test-store "});
    });

});