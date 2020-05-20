import mongoose from 'mongoose';

import { createCity, createCountry } from '../Generator';
import Messages from '../../src/errors/Messages';
import City, { ICity } from '../../src/models/City';
import Country, { ICountry } from '../../src/models/Country';
import CityService from '../../src/services/City.service';
import { IPaginationResponse } from '../../src/utilities/adapters/Pagination';

const app = require("../../src/app");

const LATITUDE = 8;
const LONGITUDE = 125;

describe("City.service", () => {
    let country: ICountry;

    beforeAll(async () => {
        country = await createCountry("test-country", "test-country", "test-country", "test-country", "test-country").save();
    });
    
    describe("create", () => {
        it("Should return validation error if required fields are not provided", async () => {
            try {
                await CityService.create(null, null, null, null ,null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                        message: Messages.CITY_NAME_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "code",
                        message: Messages.CITY_CODE_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "country",
                        message: Messages.CITY_COUNTRY_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "latitude",
                        message: Messages.CITY_LOCATION_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "longitude",
                        message: Messages.CITY_LOCATION_REQUIRED
                    })
                ]));
            }
        });

        it("Should return error if country doesn't exist", async () => {
            try {
                await CityService.create("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "country",
                        message: Messages.COUNTRY_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should return error if location is invalid", async () => {
            try {
                await CityService.create("test-city", "test-city-code", country._id.toHexString(), parseFloat("INVALID"), parseFloat("INVALID"));
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

        it("Should create city if no errors!", async () => {
            let city = await CityService.create("test-city", "test-city-code", country._id.toHexString(), LATITUDE, LONGITUDE);
            
            expect(city.name).toBe("test-city");
            expect(city.code).toBe("test-city-code");
            expect(city.location.type).toBe("Point");
            expect(city.location.coordinates).toContainEqual(LATITUDE);
            expect(city.location.coordinates).toContainEqual(LONGITUDE);
        });
    });

    describe("findAll", () => {
        it("Should return cities", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await CityService.findAll();
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: city._id,
                    name: city.name,
                })
            ]));
        });

        it("Should filter cities", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await CityService.findAll("test");
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: city._id,
                    name: city.name,
                })
            ]));
        });

        it("Should paginate results", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await CityService.findAll("", 1, 5);
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(5);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: city._id,
                    name: city.name,
                })
            ]));
        });
    });

    describe("findByCountry", () => {
        it("Should return empty cities if country id is invaid", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await CityService.findByCountry("INVALID");
            expect(response.data.length).toBe(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBe(0);
            expect(response.metadata.pagination.numberOfResults).toBe(0);
        });

        it("Should return empty cities if country doens't exist", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await CityService.findByCountry(mongoose.Types.ObjectId().toHexString());
            expect(response.data.length).toBe(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBe(0);
            expect(response.metadata.pagination.numberOfResults).toBe(0);
        });

        it("Should return cities that match", async () => {
            let countrID = mongoose.Types.ObjectId().toHexString();
            let city: ICity = await createCity("test-city", "test-city-code", countrID, LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await CityService.findByCountry(countrID);
            expect(response.data.length).toBe(1);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: city._id,
                    name: city.name,
                })
            ]));
        });

        it("Should paginate results", async () => {
            let countrID = mongoose.Types.ObjectId().toHexString();
            let city: ICity = await createCity("test-city", "test-city-code", countrID, LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await CityService.findByCountry(countrID, 1, 5);
            expect(response.data.length).toBe(1);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(5);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: city._id,
                    name: city.name,
                })
            ]));
        });
    });

    describe("findByLocation", () => {
        it("Should return empty if no cities in radius", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await CityService.findByLocation(LATITUDE + 1, LONGITUDE + 1, 10);
            expect(response.data.length).toBe(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBe(0);
            expect(response.metadata.pagination.numberOfResults).toBe(0);
        });

        it("Should return cities that are in radius", async () => {
            let countrID = mongoose.Types.ObjectId().toHexString();
            let city: ICity = await createCity("test-city", "test-city-code", countrID, LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await CityService.findByLocation(LATITUDE, LONGITUDE, 10);
            expect(response.data.length).toBe(1);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: city._id,
                    name: city.name,
                })
            ]));
        });

        it("Should paginate results", async () => {
            let countrID = mongoose.Types.ObjectId().toHexString();
            let city: ICity = await createCity("test-city", "test-city-code", countrID, LATITUDE, LONGITUDE).save();

            let response: IPaginationResponse = await CityService.findByLocation(LATITUDE, LONGITUDE, 10, 1, 5);
            expect(response.data.length).toBe(1);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(5);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: city._id,
                    name: city.name,
                })
            ]));
        });
    });

    describe("findByID", () => {
        it("Should return null if id is invalid", async () => {
            let city: ICity = await CityService.findByID("INVALID-ID");
            expect(city).toBeNull();
        });

        it("Should return null if city doesn't exist", async () => {
            let city: ICity = await CityService.findByID(mongoose.Types.ObjectId().toHexString());
            expect(city).toBeNull();
        });

        it("Should return city", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let fetchedCity: ICity = await CityService.findByID(city._id );
            expect(fetchedCity.name).toBe("test-city");
            expect(fetchedCity.code).toBe("test-city-code");
            expect(fetchedCity.location.type).toBe("Point");
            expect(fetchedCity.location.coordinates).toContainEqual(LATITUDE);
            expect(fetchedCity.location.coordinates).toContainEqual(LONGITUDE);
        });
    });

    describe("update", () => {
        it("Should return error if city doesn't exist", async () => {
            try {
                let city: ICity = await CityService.update("INVALID-ID", {});
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(404);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    Messages.CITY_NOT_FOUND
                ]));
            }
        });

        it("Should return error if country doesn't exist", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            try {
                await CityService.update(city._id, { country: "INVALID-ID" });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "country",
                        message: Messages.COUNTRY_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should update if payload is provided", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let updatedCity: ICity = await CityService.update(city._id, { code: "test-city-code-1" });
            expect(updatedCity.name).toBe("test-city");
            expect(updatedCity.code).toBe("test-city-code-1");
            expect(updatedCity.location.type).toBe("Point");
            expect(updatedCity.location.coordinates).toContainEqual(LATITUDE);
            expect(updatedCity.location.coordinates).toContainEqual(LONGITUDE);
        });

        it("Shouldn't update location if only latitude or longitude is provided", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let updatedCity: ICity = await CityService.update(city._id, { latitude: 500 });
            expect(updatedCity.name).toBe("test-city");
            expect(updatedCity.code).toBe("test-city-code");
            expect(updatedCity.location.type).toBe("Point");
            expect(updatedCity.location.coordinates).toContainEqual(LATITUDE);
            expect(updatedCity.location.coordinates).toContainEqual(LONGITUDE);
        });

        it("Shouldn't update location if latitude or longitude is not a number", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            try {
                let updatedCity: ICity = await CityService.update(city._id, { latitude: "invalid", longitude: "invalid" });
                fail();
            }
            catch (error) {
                expect(error).toBeTruthy();
            }
        });

        it("Should update location if both latitude and longitude are provided", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let updatedCity: ICity = await CityService.update(city._id, { latitude: 50, longitude: 50 });
            expect(updatedCity.name).toBe("test-city");
            expect(updatedCity.code).toBe("test-city-code");
            expect(updatedCity.location.type).toBe("Point");
            expect(updatedCity.location.coordinates).toContainEqual(50);
            expect(updatedCity.location.coordinates).toContainEqual(50);
        });

    });

    afterEach(async () => {
        await City.deleteMany({ name: "test-city"}); 
    });

    afterAll(async () => {
        await Country.deleteMany({ name: "test-country"});

        await mongoose.connection.close();
    });

});