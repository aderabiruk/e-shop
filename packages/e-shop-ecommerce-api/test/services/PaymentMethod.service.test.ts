import mongoose from 'mongoose';

import { createPaymentMethod } from '../Generator';
import Messages from '../../src/errors/Messages';
import PaymentMethod, { IPaymentMethod } from '../../src/models/PaymentMethod';
import PaymentMethodService from '../../src/services/PaymentMethod.service';
import { IPaginationResponse } from '../../src/utilities/adapters/Pagination';

const app = require("../../src/app");

describe("PaymentMethod.service", () => {
        
    describe("create", () => {
        it("Should return validation error if name is not provided", async () => {
            try {
                await PaymentMethodService.create(null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                        message: Messages.PAYMENT_METHOD_NAME_REQUIRED
                    })
                ]));
            }
        });

        it("Should create payment method ", async () => {
            let paymentMethod = await PaymentMethodService.create("test-payment-method");
            expect(paymentMethod.name).toBe("test-payment-method");
        });

    });

    describe("findAll", () => {
        it("Should return payment methods", async () => {
            await createPaymentMethod("test-payment-method").save();

            let response: IPaginationResponse = await PaymentMethodService.findAll();
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
        });
    });

    describe("findByID", () => {
        it("Should return null if id is invalid", async () => {
            let paymentMethod: IPaymentMethod = await PaymentMethodService.findByID("INVALID-ID");
            expect(paymentMethod).toBeNull();
        });

        it("Should return null if payment method doesn't exist", async () => {
            let paymentMethod: IPaymentMethod = await PaymentMethodService.findByID(mongoose.Types.ObjectId().toHexString());
            expect(paymentMethod).toBeNull();
        });

        it("Should return payment method if it exist", async () => {
            let paymentMethod: IPaymentMethod = await createPaymentMethod("test-payment-method").save();

            let fetchedPaymentMethod: IPaymentMethod = await PaymentMethodService.findByID(paymentMethod._id);
            expect(fetchedPaymentMethod).not.toBeNull();
            expect(fetchedPaymentMethod.name).toBe("test-payment-method");
        });
    });

    describe("update", () => {
        it("Should return null if payment method doesn't exist", async () => {
            try {
                let paymentMethod: IPaymentMethod = await PaymentMethodService.update(null, {});
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(404);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    Messages.PAYMENT_METHOD_NOT_FOUND
                ]));
            }
        });

        it("Shouldn't update if payload is empty", async () => {
            let PaymentMethod: IPaymentMethod = await createPaymentMethod("test-payment-method").save();

            let updatedPaymentMethod: IPaymentMethod = await PaymentMethodService.update(PaymentMethod._id, {});
            expect(updatedPaymentMethod).not.toBeNull();
            expect(updatedPaymentMethod.name).toBe("test-payment-method");
        });

        it("Shouldn update payment method description", async () => {
            let paymentMethod: IPaymentMethod = await createPaymentMethod("test-payment-method").save();

            let updatedPaymentMethod: IPaymentMethod = await PaymentMethodService.update(paymentMethod._id, { name: 'test-payment-method-2' });
            expect(updatedPaymentMethod).not.toBeNull();
            expect(updatedPaymentMethod.name).toBe("test-payment-method-2");
        });
    });

    afterEach(async () => {
        await PaymentMethod.deleteMany({ name: "test-payment-method"});
        await PaymentMethod.deleteMany({ name: "test-payment-method-2"});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

});