import mongoose from 'mongoose';

import CountryDAL from '../../src/dals/Country.dal';
import Country, { Country as ICountry } from '../../src/models/Country';

import { createCountry } from '../Generator';

const app = require("../../src/app");

describe("Country.dal", () => {
        
    describe("create", () => {
        it("Should return error if required fields are not provieded!", async () => {
            try {
                await CountryDAL.create(null, null, null, null, null);
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
                        field: "flag",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "currency_name",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "currency_code",
                    })
                ]));
            }
        });

        it("Should create country!", async () => {
            let country = await CountryDAL.create("test-country", "test-country", "test-country", "test-country", "test-country");
            expect(country.name).toBe("test-country");
            expect(country.code).toBe("test-country");
            expect(country.flag).toBe("test-country");
            expect(country.currency_name).toBe("test-country");
            expect(country.currency_code).toBe("test-country");
        });
    });

    describe("findMany", () => {
        it("Should return countries", async () => {
            await createCountry("test-country", "test-country", "test-country", "test-country", "test-country").save();

            let countries: ICountry[] = await CountryDAL.findMany({});
            expect(countries.length).toBeGreaterThan(0);
        });
    });

    describe("findOne", () => {
        it("Should return null if country doesn't exist", async () => {
            let country: ICountry = await CountryDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(country).toBeNull();
        });

        it("Should return country", async () => {
            let country: ICountry = await createCountry("test-country", "test-country", "test-country", "test-country", "test-country").save();

            let fetchedCountry: ICountry = await CountryDAL.findOne({ _id: country._id.toString() });
            expect(fetchedCountry.name).toBe("test-country");
            expect(fetchedCountry.code).toBe("test-country");
            expect(fetchedCountry.flag).toBe("test-country");
            expect(fetchedCountry.currency_name).toBe("test-country");
            expect(fetchedCountry.currency_code).toBe("test-country");
        });
    });

    describe("update", () => {
        it("Should return null if country doesn't exist", async () => {
            let country: ICountry = await CountryDAL.update(null, {});
            expect(country).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let country: ICountry = await createCountry("test-country", "test-country", "test-country", "test-country", "test-country").save();

            let updateCountry: ICountry = await CountryDAL.update(country, {});
            expect(updateCountry.name).toBe("test-country");
            expect(updateCountry.code).toBe("test-country");
            expect(updateCountry.flag).toBe("test-country");
            expect(updateCountry.currency_name).toBe("test-country");
            expect(updateCountry.currency_code).toBe("test-country");
        });

        it("Shouldn update if country description", async () => {
            let country: ICountry = await createCountry("test-country", "test-country", "test-country", "test-country", "test-country").save();

            let updateCountry: ICountry = await CountryDAL.update(country, { flag: 'test-country-flag', code: 'test-country-code' });
            expect(updateCountry.name).toBe("test-country");
            expect(updateCountry.code).toBe("test-country-code");
            expect(updateCountry.flag).toBe("test-country-flag");
            expect(updateCountry.currency_name).toBe("test-country");
            expect(updateCountry.currency_code).toBe("test-country");
        });
    });

    describe("deleteHard", () => {
        it("Should return 0 deletedCount if country doesn't exist", async () => {
            let result: any = await CountryDAL.deleteHard({ _id: mongoose.Types.ObjectId().toString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete country if it exists", async () => {
            let country: ICountry = await createCountry("test-country", "test-country", "test-country", "test-country", "test-country").save();

            let result: any = await CountryDAL.deleteHard({ _id: country._id.toString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null country  is passed", async () => {
            let country: ICountry = await CountryDAL.deleteSoft(null);
            expect(country).toBeNull();
        });

        it("Should delete country if it exists", async () => {
            let country: ICountry = await createCountry("test-country", "test-country", "test-country", "test-country", "test-country").save();

            let deletedCountry: ICountry = await CountryDAL.deleteSoft(country);
            expect(deletedCountry.name).toBe("test-country");
            expect(deletedCountry.code).toBe("test-country");
            expect(deletedCountry.flag).toBe("test-country");
            expect(deletedCountry.currency_name).toBe("test-country");
            expect(deletedCountry.currency_code).toBe("test-country");
            expect(deletedCountry.deleted_at).toBeTruthy();
        });
    });

    afterEach(async () => {
        await Country.deleteMany({ name: "test-country" });
    });

    afterAll(() => {
        mongoose.connection.close();
    });

});