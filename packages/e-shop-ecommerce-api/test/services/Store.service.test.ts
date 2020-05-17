import mongoose from 'mongoose';

import Messages from '../../src/errors/Messages';
import City, { ICity } from '../../src/models/City';
import Store, { IStore } from '../../src/models/Store';
import { createStore, createCity } from '../Generator';
import StoreService from '../../src/services/Store.service';
import { IPaginationResponse } from '../../src/utilities/adapters/Pagination';

const app = require("../../src/app");

const LATITUDE = 125;
const LONGITUDE = 99;

describe("Store.service", () => {
    let city: ICity;

    beforeAll(async () => {
        city = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();
    });
    
    describe("create", () => {
        it("Should return validation error if required fields are not provided", async () => {
            try {
                await StoreService.create(null, null, null, null ,null, null, null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                        message: Messages.STORE_NAME_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "email",
                        message: Messages.STORE_EMAIL_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "phone_number",
                        message: Messages.STORE_PHONE_NUMBER_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "city",
                        message: Messages.STORE_CITY_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "latitude",
                        message: Messages.STORE_LOCATION_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "longitude",
                        message: Messages.STORE_LOCATION_REQUIRED
                    })
                ]));
            }
        });

        it("Should return error if city doesn't exist", async () => {
            try {
                await StoreService.create("test-store", "test-store-email@gmail.com", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "city",
                        message: Messages.CITY_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should create store if no errors!", async () => {
            let store = await StoreService.create("test-store", "test-store-email@gmail.com", "test-store-phone-number", city._id.toString(), "test-store-address", LATITUDE, LONGITUDE);
            
            expect(store.name).toBe("test-store");
            expect(store.email).toBe("test-store-email@gmail.com");
            expect(store.phone_number).toBe("test-store-phone-number");
            expect(store.address).toBe("test-store-address");
            expect(store.location.type).toBe("Point");
            expect(store.location.coordinates).toContainEqual(LATITUDE);
            expect(store.location.coordinates).toContainEqual(LONGITUDE);
        });
    });

    describe("findAll", () => {
        it("Should return stores", async () => {
            await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await StoreService.findAll();
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
        });
    });

    describe("findByID", () => {
        it("Should return null if id is invalid", async () => {
            let store: IStore = await StoreService.findByID("INVALID-ID");
            expect(store).toBeNull();
        });

        it("Should return null if store doesn't exist", async () => {
            let store: IStore = await StoreService.findByID(mongoose.Types.ObjectId().toHexString());
            expect(store).toBeNull();
        });

        it("Should return Store", async () => {
            let store: IStore = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let fetchedStore: IStore = await StoreService.findByID(store._id );
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
        it("Should return error if store doesn't exist", async () => {
            try {
                let store: IStore = await StoreService.update("INVALID-ID", {});
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(404);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    Messages.STORE_NOT_FOUND
                ]));
            }
        });

        it("Should return error if city doesn't exist", async () => {
            let store: IStore = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            try {
                await StoreService.update(store._id, { city: "INVALID-ID" });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "city",
                        message: Messages.CITY_NOT_FOUND
                    })
                ]));
            }
        });

        it("Shouldn't update if payload is empty", async () => {
            let store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let updatedStore: IStore = await StoreService.update(store._id, {});
            expect(updatedStore).not.toBeNull();
            expect(updatedStore.name).toBe("test-store");
            expect(updatedStore.email).toBe("test-store-email");
            expect(updatedStore.phone_number).toBe("test-store-phone-number");
            expect(updatedStore.address).toBe("test-store-address");
            expect(updatedStore.location.type).toBe("Point");
            expect(updatedStore.location.coordinates).toContainEqual(LATITUDE);
            expect(updatedStore.location.coordinates).toContainEqual(LONGITUDE);
        });

        it("Should update email", async () => {
            let store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let updatedStore: IStore = await StoreService.update(store._id, { email: "test-store-email-1" });
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

            let updatedStore: IStore = await StoreService.update(store._id, { latitude: 500 });
            expect(updatedStore).not.toBeNull();
            expect(updatedStore.name).toBe("test-store");
            expect(updatedStore.email).toBe("test-store-email");
            expect(updatedStore.phone_number).toBe("test-store-phone-number");
            expect(updatedStore.address).toBe("test-store-address");
            expect(updatedStore.location.type).toBe("Point");
            expect(updatedStore.location.coordinates).toContainEqual(LATITUDE);
            expect(updatedStore.location.coordinates).toContainEqual(LONGITUDE);
        });

        it("Shouldn't update location if latitude and longitude are not numbers", async () => {
            let store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            try {
                let updatedStore: IStore = await StoreService.update(store._id, { latitude: "invalid", longitude: "invalid" });
                fail();
            }
            catch (error) {
                expect(error).toBeTruthy();
            }
        });

        it("Should update location if both latitude and longitude are provided", async () => {
            let store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let updatedStore: IStore = await StoreService.update(store._id, { latitude: 500, longitude: 500 });
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

    afterEach(async () => {
        await Store.deleteMany({ name: "test-store"}); 
    });

    afterAll(async () => {
        await City.deleteMany({ name: "test-city"}); 

        await mongoose.connection.close();
    });

});