import moment from 'moment';
import mongoose from 'mongoose';

import DiscountDAL from '../../src/dals/Discount.dal';
import Discount, { IDiscount } from '../../src/models/Discount';

import { createPaymentMethod, createDiscount } from '../Generator';

const app = require("../../src/app");

const START_DATE = moment().subtract(30, 'days').toDate();
const END_DATE = moment().toDate();

describe("Discount.dal", () => {
        
    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await DiscountDAL.create(null, null, null, null, null);
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
                        field: "start_date",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "end_date",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "percentage",
                    })
                ]));
            }
        });

        it("Should return error if percentage is less than 0!", async () => {
            try {
                await DiscountDAL.create("test-discount", "test-discount-code", -1, START_DATE, END_DATE);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "percentage",
                    })
                ]));
            }
        });

        it("Should return error if percentage is less than 0!", async () => {
            try {
                await DiscountDAL.create("test-discount", "test-discount-code", 101, START_DATE, END_DATE);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "percentage",
                    })
                ]));
            }
        });

        it("Should create discount!", async () => {
            let discount = await DiscountDAL.create("test-discount", "test-discount-code", 15, START_DATE, END_DATE);
            expect(discount.name).toBe("test-discount");
            expect(discount.code).toBe("test-discount-code");
            expect(discount.percentage).toBe(15);
            expect(discount.start_date).toBe(START_DATE);
            expect(discount.end_date).toBe(END_DATE);
        });
    });

    describe("findMany", () => {
        it("Should return discounts", async () => {
            await createDiscount("test-discount", "test-discount-code", 15, START_DATE, END_DATE).save();

            let discounts: IDiscount[] = await DiscountDAL.findMany({});
            expect(discounts.length).toBeGreaterThan(0);
        });
    });

    describe("findOne", () => {
        it("Should return null if discount doesn't exist", async () => {
            let discount: IDiscount = await DiscountDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(discount).toBeNull();
        });

        it("Should return discount", async () => {
            let discount =  await createDiscount("test-discount", "test-discount-code", 15, START_DATE, END_DATE).save();

            let fetchedDiscount: IDiscount = await DiscountDAL.findOne({ _id: discount._id.toString() });
            expect(fetchedDiscount.name).toBe("test-discount");
            expect(fetchedDiscount.code).toBe("test-discount-code");
            expect(fetchedDiscount.percentage).toBe(15);
            expect(fetchedDiscount.start_date.getMilliseconds()).toBe(START_DATE.getMilliseconds());
            expect(fetchedDiscount.end_date.getMilliseconds()).toBe(END_DATE.getMilliseconds());
        });
    });

    describe("update", () => {
        it("Should return null if discount doesn't exist", async () => {
            let discount: IDiscount = await DiscountDAL.update(null, {});
            expect(discount).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let discount =  await createDiscount("test-discount", "test-discount-code", 15, START_DATE, END_DATE).save();

            let updatedPaymentMethod: IDiscount = await DiscountDAL.update(discount, {});
            expect(updatedPaymentMethod).not.toBeNull();
            expect(updatedPaymentMethod.name).toBe("test-discount");
        });

        it("Should return error if percentage is not a number", async () => {
            let discount =  await createDiscount("test-discount", "test-discount-code", 15, START_DATE, END_DATE).save();

            try {
                let updatedPaymentMethod: IDiscount = await DiscountDAL.update(discount, { percentage: "invalid" });
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "percentage",
                    })
                ]));
            }
        });

        it("Should return error if percentage is less than 0", async () => {
            let discount =  await createDiscount("test-discount", "test-discount-code", 15, START_DATE, END_DATE).save();

            try {
                let updatedPaymentMethod: IDiscount = await DiscountDAL.update(discount, { percentage: -1 });
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "percentage",
                    })
                ]));
            }
        });

        it("Should return error if percentage is greater than 100", async () => {
            let discount =  await createDiscount("test-discount", "test-discount-code", 15, START_DATE, END_DATE).save();

            try {
                let updatedPaymentMethod: IDiscount = await DiscountDAL.update(discount, { percentage: 101 });
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "percentage",
                    })
                ]));
            }
        });

        it("Should update discount name", async () => {
            let discount =  await createDiscount("test-discount", "test-discount-code", 15, START_DATE, END_DATE).save();

            let updatedDiscount: IDiscount = await DiscountDAL.update(discount, { percentage: 20 });
            expect(updatedDiscount.name).toBe("test-discount");
            expect(updatedDiscount.code).toBe("test-discount-code");
            expect(updatedDiscount.percentage).toBe(20);
            expect(updatedDiscount.start_date.getMilliseconds()).toBe(START_DATE.getMilliseconds());
            expect(updatedDiscount.end_date.getMilliseconds()).toBe(END_DATE.getMilliseconds());
        });
    });

    describe("deleteHard", () => {
        it("Should return 0 deletedCount if discount doesn't exist", async () => {
            let result: any = await DiscountDAL.deleteHard({ _id: mongoose.Types.ObjectId().toString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete discount if it exists", async () => {
            let discount =  await createDiscount("test-discount", "test-discount-code", 15, START_DATE, END_DATE).save();

            let result: any = await DiscountDAL.deleteHard({ _id: discount._id.toString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null discount is passed", async () => {
            let discount: IDiscount = await DiscountDAL.deleteSoft(null);
            expect(discount).toBeNull();
        });

        it("Should soft delete discount if it exists", async () => {
            let discount =  await createDiscount("test-discount", "test-discount-code", 15, START_DATE, END_DATE).save();

            let deletedPaymentMethod: IDiscount = await DiscountDAL.deleteSoft(discount);
            expect(deletedPaymentMethod).not.toBeNull();
            expect(deletedPaymentMethod.deleted_at).toBeTruthy();
        });
    });

    afterEach(async () => {
        await Discount.deleteMany({ name: "test-discount" });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

});