import mongoose from 'mongoose';

import { createCountry } from '../Generator';
import Messages from '../../src/errors/Messages';
import Country, { ICountry } from '../../src/models/Country';
import CountryService from '../../src/services/Country.service';
import { IPaginationResponse } from '../../src/utilities/adapters/Pagination';

const app = require("../../src/app");

describe("Country.service", () => {
        
    describe("create", () => {
        it("Should return validation error if name is not provided", async () => {
            try {
                await CountryService.create(null, null, null, null, null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                        message: Messages.COUNTRY_NAME_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "code",
                        message: Messages.COUNTRY_CODE_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "flag",
                        message: Messages.COUNTRY_FLAG_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "currency_name",
                        message: Messages.COUNTRY_CURRENCY_NAME_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "currency_code",
                        message: Messages.COUNTRY_CURRENCY_CODE_REQUIRED
                    })
                ]));
            }
        });

        it("Should create country ", async () => {
            let country = await CountryService.create("test-country", "test-country", "test-country", "test-country", "test-country");
            expect(country.name).toBe("test-country");
            expect(country.code).toBe("test-country");
            expect(country.flag).toBe("test-country");
            expect(country.currency_name).toBe("test-country");
            expect(country.currency_code).toBe("test-country");
        })
    });

    describe("findAll", () => {
        it("Should return all categories", async () => {
            let country: ICountry = await createCountry("test-country", "test-country", "test-country", "test-country", "test-country").save();

            let response: IPaginationResponse = await CountryService.findAll();
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: country._id,
                    name: country.name,
                    code: country.code,
                    currency_name: country.currency_name,
                    currency_code: country.currency_code
                })
            ]));
        });

        it("Should paginate results", async () => {
            let country: ICountry = await createCountry("test-country", "test-country", "test-country", "test-country", "test-country").save();

            let response: IPaginationResponse = await CountryService.findAll("", 1, 5);
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(5);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: country._id,
                    name: country.name,
                    code: country.code,
                    currency_name: country.currency_name,
                    currency_code: country.currency_code
                })
            ]));
        });
    });

    describe("findByID", () => {
        it("Should return null if id is invalid", async () => {
            let country: ICountry = await CountryService.findByID("INVALID-ID");
            expect(country).toBeNull();
        });

        it("Should return null if country doesn't exist", async () => {
            let country: ICountry = await CountryService.findByID(mongoose.Types.ObjectId().toHexString());
            expect(country).toBeNull();
        });

        it("Should return country if it exist", async () => {
            let country: ICountry = await createCountry("test-country", "test-country", "test-country", "test-country", "test-country").save();

            let fetchedCountry: ICountry = await CountryService.findByID(country._id);
            expect(fetchedCountry.name).toBe("test-country");
            expect(fetchedCountry.code).toBe("test-country");
            expect(fetchedCountry.flag).toBe("test-country");
            expect(fetchedCountry.currency_name).toBe("test-country");
            expect(fetchedCountry.currency_code).toBe("test-country");
        });
    });

    describe("update", () => {
        it("Should return null if country doesn't exist", async () => {
            try {
                let country: ICountry = await CountryService.update(null, {});
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(404);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    Messages.COUNTRY_NOT_FOUND
                ]));
            }
        });

        it("Shouldn't update if payload is empty", async () => {
            let country: ICountry = await createCountry("test-country", "test-country", "test-country", "test-country", "test-country").save();

            let updateCountry: ICountry = await CountryService.update(country._id, {});
            expect(updateCountry.name).toBe("test-country");
            expect(updateCountry.code).toBe("test-country");
            expect(updateCountry.flag).toBe("test-country");
            expect(updateCountry.currency_name).toBe("test-country");
            expect(updateCountry.currency_code).toBe("test-country");
        });

        it("Shouldn update if country description", async () => {
            let country: ICountry = await createCountry("test-country", "test-country", "test-country", "test-country", "test-country").save();

            let updateCountry: ICountry = await CountryService.update(country._id, { flag: 'test-country-flag', code: 'test-country-code' });
            expect(updateCountry.name).toBe("test-country");
            expect(updateCountry.code).toBe("test-country-code");
            expect(updateCountry.flag).toBe("test-country-flag");
            expect(updateCountry.currency_name).toBe("test-country");
            expect(updateCountry.currency_code).toBe("test-country");
        });
    });

    afterEach(async () => {
        await Country.deleteMany({ name: "test-country"});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

});