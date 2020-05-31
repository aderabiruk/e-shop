import mongoose from 'mongoose';

import Messages from '../../src/errors/Messages';
import City, { ICity } from '../../src/models/City';
import Store, { IStore } from '../../src/models/Store';
import { createStore, createCity } from '../Generator';
import StoreService from '../../src/services/Store.service';
import { IPaginationResponse } from '../../src/utilities/adapters/Pagination';

const app = require("../../src/app");

const LATITUDE = 50;
const LONGITUDE = 50;

describe("Store.service", () => {
    let city: ICity;

    beforeAll(async () => {
        city = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();
    });
    
    describe("create", () => {
        it("Should return validation error if required fields are not provided", async () => {
            try {
                await StoreService.create(null, null, null, city._id ,null, null, null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name"
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "email"
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "phone_number"
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "address"
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

        it("Should return error if location is invalid", async () => {
            try {
                await StoreService.create("test-store", "test-store-email@gmail.com", "test-store-phone-number", city._id.toString(), "test-store-address", parseFloat("INVALID"), parseFloat("INVALID"));
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "location.coordinates",
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
            let store: IStore = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await StoreService.findAll();
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: store._id,
                    name: store.name,
                })
            ]));
        });

        it("Should filter stores", async () => {
            let store: IStore = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await StoreService.findAll("test");
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: store._id,
                    name: store.name,
                })
            ]));
        });

        it("Should paginate results", async () => {
            let store: IStore = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await StoreService.findAll("test", 1, 5);
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(5);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: store._id,
                    name: store.name,
                })
            ]));
        });
    });

    describe("findByCity", () => {
        it("Should return empty list if city id is invaid", async () => {
            let store: IStore = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await StoreService.findByCity("INVALID")
            expect(response.data.length).toBe(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBe(0);
            expect(response.metadata.pagination.numberOfResults).toBe(0);
        });

        it("Should return empty list if city doens't exist", async () => {
            let store: IStore = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await StoreService.findByCity(mongoose.Types.ObjectId().toHexString())
            expect(response.data.length).toBe(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBe(0);
            expect(response.metadata.pagination.numberOfResults).toBe(0);
        });

        it("Should return stores that match", async () => {
            let cityID = mongoose.Types.ObjectId().toHexString();
            let store: IStore = await createStore("test-store", "test-store-email", "test-store-phone-number", cityID, "test-store-address", LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await StoreService.findByCity(cityID)
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: store._id,
                    name: store.name,
                })
            ]));
        });

        it("Should paginate result", async () => {
            let cityID = mongoose.Types.ObjectId().toHexString();
            let store: IStore = await createStore("test-store", "test-store-email", "test-store-phone-number", cityID, "test-store-address", LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await StoreService.findByCity(cityID, 1, 5)
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(5);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: store._id,
                    name: store.name,
                })
            ]));
        });
    });

    describe("findByLocation", () => {
        it("Should return empty list if no stores in radius", async () => {
            let store: IStore = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await StoreService.findByLocation(LATITUDE + 1, LONGITUDE + 1, 10);
            expect(response.data.length).toBe(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBe(0);
            expect(response.metadata.pagination.numberOfResults).toBe(0);
        });

        it("Should return stores that are in radius", async () => {
            let store: IStore = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await StoreService.findByLocation(LATITUDE, LONGITUDE, 10);
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: store._id,
                    name: store.name,
                })
            ]));
        });

        it("Should paginate result", async () => {
            let store: IStore = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await StoreService.findByLocation(LATITUDE, LONGITUDE, 10, 1, 5);
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(5);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: store._id,
                    name: store.name,
                })
            ]));
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

            let updatedStore: IStore = await StoreService.update(store._id, { latitude: 20, longitude: 20 });
            expect(updatedStore).not.toBeNull();
            expect(updatedStore.name).toBe("test-store");
            expect(updatedStore.email).toBe("test-store-email");
            expect(updatedStore.phone_number).toBe("test-store-phone-number");
            expect(updatedStore.address).toBe("test-store-address");
            expect(updatedStore.location.type).toBe("Point");
            expect(updatedStore.location.coordinates).toContainEqual(20);
            expect(updatedStore.location.coordinates).toContainEqual(20);
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