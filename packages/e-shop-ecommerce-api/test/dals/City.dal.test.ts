import mongoose from 'mongoose';

import CityDAL from '../../src/dals/City.dal';
import City, { ICity } from '../../src/models/City';
import { createCity } from '../Generator';

const app = require("../../src/app");

const LATITUDE = 125;
const LONGITUDE = 99;

describe("Store.dal", () => {
        
    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await CityDAL.create(null, null, null, null ,null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "code",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "country_id",
                    })
                ]));
            }
        });

        it("Should create city if no errors!", async () => {
            let city = await CityDAL.create("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE);
            
            expect(city.name).toBe("test-city");
            expect(city.code).toBe("test-city-code");
            expect(city.location.type).toBe("Point");
            expect(city.location.coordinates).toContainEqual(LATITUDE);
            expect(city.location.coordinates).toContainEqual(LONGITUDE);
        });
    });

    describe("findMany", () => {
        it("Should return cities", async () => {
            await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let cities: ICity[] = await CityDAL.findMany({});
            expect(cities.length).toBeGreaterThan(0);
        });
    });

    describe("findOne", () => {
        it("Should return null if city doesn't exist", async () => {
            let city: ICity = await CityDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(city).toBeNull();
        });

        it("Should return city", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let fetchedCity: ICity = await CityDAL.findOne({ _id: city._id });
            expect(fetchedCity.name).toBe("test-city");
            expect(fetchedCity.code).toBe("test-city-code");
            expect(fetchedCity.location.type).toBe("Point");
            expect(fetchedCity.location.coordinates).toContainEqual(LATITUDE);
            expect(fetchedCity.location.coordinates).toContainEqual(LONGITUDE);
        });
    });

    describe("update", () => {
        it("Should return null if city doesn't exist", async () => {
            let city: ICity = await CityDAL.update(null, {});
            expect(city).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let updatedCity: ICity = await CityDAL.update(city, {});
            expect(updatedCity.name).toBe("test-city");
            expect(updatedCity.code).toBe("test-city-code");
            expect(updatedCity.location.type).toBe("Point");
            expect(updatedCity.location.coordinates).toContainEqual(LATITUDE);
            expect(updatedCity.location.coordinates).toContainEqual(LONGITUDE);
        });

        it("Should update if payload is provided", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let updatedCity: ICity = await CityDAL.update(city, { code: "test-city-code-1" });
            expect(updatedCity.name).toBe("test-city");
            expect(updatedCity.code).toBe("test-city-code-1");
            expect(updatedCity.location.type).toBe("Point");
            expect(updatedCity.location.coordinates).toContainEqual(LATITUDE);
            expect(updatedCity.location.coordinates).toContainEqual(LONGITUDE);
        });

        it("Shouldn't update location if only latitude or longitude is provided", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let updatedCity: ICity = await CityDAL.update(city, { latitude: 500 });
            expect(updatedCity.name).toBe("test-city");
            expect(updatedCity.code).toBe("test-city-code");
            expect(updatedCity.location.type).toBe("Point");
            expect(updatedCity.location.coordinates).toContainEqual(LATITUDE);
            expect(updatedCity.location.coordinates).toContainEqual(LONGITUDE);
        });

        it("Shouldn't update location if latitude or longitude is not a number", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            try {
                let updatedCity: ICity = await CityDAL.update(city, { latitude: "invalid", longitude: "invalid" });
                fail();
            }
            catch (error) {
                expect(error).toBeTruthy();
            }
        });

        it("Should update location if both latitude and longitude are provided", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let updatedCity: ICity = await CityDAL.update(city, { latitude: 500, longitude: 500 });
            expect(updatedCity.name).toBe("test-city");
            expect(updatedCity.code).toBe("test-city-code");
            expect(updatedCity.location.type).toBe("Point");
            expect(updatedCity.location.coordinates).toContainEqual(500);
            expect(updatedCity.location.coordinates).toContainEqual(500);
        });

    });
    
    describe("deleteHard", () => {
        it("Should return 0 deletedCount if city doesn't exist", async () => {
            let result: any = await CityDAL.deleteHard({ _id: mongoose.Types.ObjectId().toString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete city if it exists", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let result: any = await CityDAL.deleteHard({ _id: city._id.toString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null city is passed", async () => {
            let city: ICity = await CityDAL.deleteSoft(null);
            expect(city).toBeNull();
        });

        it("Should soft delete city if it exists", async () => {
            let city: ICity = await createCity("test-city", "test-city-code", mongoose.Types.ObjectId().toHexString(), LATITUDE, LONGITUDE).save();

            let deletedCity: ICity = await CityDAL.deleteSoft(city);
            expect(deletedCity.name).toBe("test-city");
            expect(deletedCity.code).toBe("test-city-code");
            expect(deletedCity.location.type).toBe("Point");
            expect(deletedCity.location.coordinates).toContainEqual(LATITUDE);
            expect(deletedCity.location.coordinates).toContainEqual(LONGITUDE);
            expect(deletedCity.deleted_at).toBeTruthy();
        });
    });

    afterEach(async () => {
        await City.deleteMany({ name: "test-city"});
    });

    afterAll(() => {
        mongoose.connection.close();
    });

});