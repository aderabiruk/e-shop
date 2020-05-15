import moment from 'moment';
import mongoose from 'mongoose';

import CustomerDAL from '../../src/dals/Customer.dal';
import Customer, { ICustomer } from '../../src/models/Customer';
import { createCustomer } from '../Generator';
import { Gender } from '../../src/utilities/constants/General';

const app = require("../../src/app");

describe("Customer.dal", () => {

    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await CustomerDAL.create(null, null, null, null ,null, null, null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "first_name",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "last_name",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "email",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "phone_number",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "gender",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "store_id",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "birth_day",
                    })
                ]));
            }
        });

        it("Should return error if invalid gender provided!", async () => {
            try {
                await CustomerDAL.create("test-first-name", "test-last-name", "test-email", "test-phone-number", "INVALID", mongoose.Types.ObjectId().toHexString(), moment().toDate());
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "gender",
                    })
                ]));
            }
        });

        it("Should create customer if no errors", async () => {
            let birth_day = moment().toDate();
            let store_id = mongoose.Types.ObjectId().toHexString();
            let customer = await CustomerDAL.create("test-first-name", "test-last-name", "test-email", "test-phone-number", Gender.MALE, store_id, birth_day);
            
            expect(customer.first_name).toBe("test-first-name");
            expect(customer.last_name).toBe("test-last-name");
            expect(customer.email).toBe("test-email");
            expect(customer.phone_number).toBe("test-phone-number");
            expect(customer.gender).toBe(Gender.MALE);
            expect(customer.store_id.toString()).toBe(store_id.toString());
            expect(customer.birth_day).toBe(birth_day);
        });
    });

    describe("findMany", () => {
        it("Should return customers", async () => {
            await createCustomer("test-first-name", "test-last-name", "test-email", "test-phone-number", Gender.MALE, mongoose.Types.ObjectId().toHexString(), moment().toDate()).save();

            let customers: ICustomer[] = await CustomerDAL.findMany({});
            expect(customers.length).toBeGreaterThan(0);
        });

        it("Should filter customer by email", async () => {
            await createCustomer("test-first-name", "test-last-name", "test-email", "test-phone-number", Gender.MALE, mongoose.Types.ObjectId().toHexString(), moment().toDate()).save();

            let customers: ICustomer[] = await CustomerDAL.findMany({ email: "test-email" });
            expect(customers.length).toBe(1);
        });
    });

    describe("findOne", () => {
        it("Should return null if customer doesn't exist", async () => {
            let customer: ICustomer = await CustomerDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(customer).toBeNull();
        });

        it("Should return customer", async () => {
            let customer: ICustomer = await createCustomer("test-first-name", "test-last-name", "test-email", "test-phone-number", Gender.MALE, mongoose.Types.ObjectId().toHexString(), moment().toDate()).save();

            let fetchedStore: ICustomer = await CustomerDAL.findOne({ _id: customer._id });
            expect(fetchedStore.first_name).toBe("test-first-name");
            expect(fetchedStore.last_name).toBe("test-last-name");
            expect(fetchedStore.email).toBe("test-email");
            expect(fetchedStore.phone_number).toBe("test-phone-number");
            expect(fetchedStore.gender).toBe(Gender.MALE);
        });
    });

    describe("update", () => {
        it("Should return null if customer doesn't exist", async () => {
            let customer: ICustomer = await CustomerDAL.update(null, {});
            expect(customer).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let customer: ICustomer = await createCustomer("test-first-name", "test-last-name", "test-email", "test-phone-number", Gender.MALE, mongoose.Types.ObjectId().toHexString(), moment().toDate()).save();
            
            let updateCustomer: ICustomer = await CustomerDAL.update(customer, {  });
            expect(updateCustomer.first_name).toBe("test-first-name");
            expect(updateCustomer.last_name).toBe("test-last-name");
            expect(updateCustomer.email).toBe("test-email");
            expect(updateCustomer.phone_number).toBe("test-phone-number");
            expect(updateCustomer.gender).toBe(Gender.MALE);
        });

        it("Should update customer", async () => {
            let customer: ICustomer = await createCustomer("test-first-name", "test-last-name", "test-email", "test-phone-number", Gender.MALE, mongoose.Types.ObjectId().toHexString(), moment().toDate()).save();
            
            let updateCustomer: ICustomer = await CustomerDAL.update(customer, { first_name: "test-first-name-1", last_name: "test-last-name-1" });
            expect(updateCustomer.first_name).toBe("test-first-name-1");
            expect(updateCustomer.last_name).toBe("test-last-name-1");
            expect(updateCustomer.email).toBe("test-email");
            expect(updateCustomer.phone_number).toBe("test-phone-number");
            expect(updateCustomer.gender).toBe(Gender.MALE);
        });
    });

    describe("deleteHard", () => {
        it("Should return 0 deletedCount if customer doesn't exist", async () => {
            let result: any = await CustomerDAL.deleteHard({ _id: mongoose.Types.ObjectId().toHexString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete customer if it exists", async () => {
            let customer: ICustomer = await createCustomer("test-first-name", "test-last-name", "test-email", "test-phone-number", Gender.MALE, mongoose.Types.ObjectId().toHexString(), moment().toDate()).save();

            let result: any = await CustomerDAL.deleteHard({ _id: customer._id.toHexString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null product is passed", async () => {
            let customer: ICustomer = await CustomerDAL.deleteSoft(null);
            expect(customer).toBeNull();
        });

        it("Should soft delete product if it exists", async () => {
            let customer: ICustomer = await createCustomer("test-first-name", "test-last-name", "test-email", "test-phone-number", Gender.MALE, mongoose.Types.ObjectId().toHexString(), moment().toDate()).save();

            let deletedCustomer: ICustomer = await CustomerDAL.deleteSoft(customer);
            expect(deletedCustomer).not.toBeNull();
            expect(deletedCustomer.deleted_at).toBeTruthy();
        });
    });

    afterEach(async () => {
        await Customer.deleteMany({ email: "test-email", phone_number: "test-phone-number" });
    });

});