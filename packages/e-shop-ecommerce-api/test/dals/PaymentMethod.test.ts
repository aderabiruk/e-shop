import mongoose from 'mongoose';

import PaymentMethodDAL from '../../src/dals/PaymentMethod.dal';
import PaymentMethod, { IPaymentMethod } from '../../src/models/PaymentMethod';

import { createPaymentMethod } from '../Generator';

const app = require("../../src/app");

describe("PaymentMethod.dal", () => {
        
    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await PaymentMethodDAL.create(null);
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

        it("Should return error if payment method already exists!", async () => {
            await createPaymentMethod("test-payment-method").save();

            try {
                await PaymentMethodDAL.create("test-payment-method");
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

        it("Should create payment method!", async () => {
            let payment_method = await PaymentMethodDAL.create("test-payment-method");
            expect(payment_method.name).toBe("test-payment-method");
        });
    });

    describe("findMany", () => {
        it("Should return payment methods", async () => {
            await createPaymentMethod("test-payment-method").save();

            let payment_methods: IPaymentMethod[] = await PaymentMethodDAL.findMany({});
            expect(payment_methods.length).toBeGreaterThan(0);
        });
    });

    describe("findOne", () => {
        it("Should return null if payment method doesn't exist", async () => {
            let payment_method: IPaymentMethod = await PaymentMethodDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(payment_method).toBeNull();
        });

        it("Should return payment method", async () => {
            let payment_method = await createPaymentMethod("test-payment-method").save();

            let fetchedPaymentMethod: IPaymentMethod = await PaymentMethodDAL.findOne({ _id: payment_method._id.toString() });
            expect(fetchedPaymentMethod).not.toBeNull();
            expect(fetchedPaymentMethod.name).toBe("test-payment-method");
        });
    });

    describe("update", () => {
        it("Should return null if payment method doesn't exist", async () => {
            let payment_method: IPaymentMethod = await PaymentMethodDAL.update(null, {});
            expect(payment_method).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let payment_method = await createPaymentMethod("test-payment-method").save();

            let updatedPaymentMethod: IPaymentMethod = await PaymentMethodDAL.update(payment_method, {});
            expect(updatedPaymentMethod).not.toBeNull();
            expect(updatedPaymentMethod.name).toBe("test-payment-method");
        });

        it("Should return error if payment name already exists", async () => {
            let payment_method1 = await createPaymentMethod("test-payment-method").save();
            let payment_method2 = await createPaymentMethod("test-payment-method-1").save();

            try {
                let updatedPaymentMethod: IPaymentMethod = await PaymentMethodDAL.update(payment_method1, {name: "test-payment-method-1"});
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

        it("Should update payment method name", async () => {
            let payment_method = await createPaymentMethod("test-payment-method").save();

            let updatedPaymentMethod: IPaymentMethod = await PaymentMethodDAL.update(payment_method, { name: "test-payment-method-1" });
            expect(updatedPaymentMethod).not.toBeNull();
            expect(updatedPaymentMethod.name).toBe("test-payment-method-1");
        });
    });

    describe("deleteHard", () => {
        it("Should return 0 deletedCount if payment method doesn't exist", async () => {
            let result: any = await PaymentMethodDAL.deleteHard({ _id: mongoose.Types.ObjectId().toString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete payment method if it exists", async () => {
            let payment_method = await createPaymentMethod("test-payment-method").save();

            let result: any = await PaymentMethodDAL.deleteHard({ _id: payment_method._id.toString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null payment method is passed", async () => {
            let payment_method: IPaymentMethod = await PaymentMethodDAL.deleteSoft(null);
            expect(payment_method).toBeNull();
        });

        it("Should soft delete payment method if it exists", async () => {
            let payment_method = await createPaymentMethod("test-payment-method").save();

            let deletedPaymentMethod: IPaymentMethod = await PaymentMethodDAL.deleteSoft(payment_method);
            expect(deletedPaymentMethod).not.toBeNull();
            expect(deletedPaymentMethod.name).toBe("test-payment-method");
            expect(deletedPaymentMethod.deleted_at).toBeTruthy();
        });
    });

    afterEach(async () => {
        await PaymentMethod.deleteMany({ name: "test-payment-method" });
        await PaymentMethod.deleteMany({ name: "test-payment-method-1" });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

});