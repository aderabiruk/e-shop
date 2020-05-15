import mongoose from 'mongoose';

import CategoryDAL from '../../src/dals/Category.dal';
import Category, { Category as ICategory } from '../../src/models/Category';
import { createCategory } from '../Generator';

const app = require("../../src/app");

describe("Category.dal", () => {
        
    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await CategoryDAL.create(null, null, null, null ,null);
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

        it("Should create category if all fields are provided", async () => {
            let category = await CategoryDAL.create("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description");
            expect(category.name).toBe("test-category");
            expect(category.slug).toBe("test-category");
            expect(category.image_url).toBe("test-image-url");
            expect(category.description).toBe("test-category-description");
        });
    });

    describe("findMany", () => {
        it("Should return categories", async () => {
            await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();

            let categories: ICategory[] = await CategoryDAL.findMany({});
            expect(categories.length).toBeGreaterThan(0);
        });
    });

    describe("findOne", () => {
        it("Should return null if category doesn't exist", async () => {
            let category: ICategory = await CategoryDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(category).toBeNull();
        });

        it("Should return category", async () => {
            let category = await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();

            let fetchedCategory: ICategory = await CategoryDAL.findOne({ _id: category._id.toString() });
            expect(fetchedCategory).not.toBeNull();
            expect(category.name).toBe("test-category");
            expect(category.slug).toBe("test-category");
            expect(category.image_url).toBe("test-image-url");
            expect(category.description).toBe("test-category-description");
        });
    });

    describe("update", () => {
        it("Should return null if category doesn't exist", async () => {
            let category: ICategory = await CategoryDAL.update(null, {});
            expect(category).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let category = await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();

            let updatedCategory: ICategory = await CategoryDAL.update(category, {});
            expect(updatedCategory).not.toBeNull();
            expect(updatedCategory.name).toBe("test-category");
            expect(updatedCategory.slug).toBe("test-category");
            expect(updatedCategory.image_url).toBe("test-image-url");
            expect(updatedCategory.description).toBe("test-category-description");
        });

        it("Should update slug field", async () => {
            let category = await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();

            let updatedCategory: ICategory = await CategoryDAL.update(category, { slug: "test-category-slug"});
            expect(updatedCategory).not.toBeNull();
            expect(updatedCategory.name).toBe("test-category");
            expect(updatedCategory.slug).toBe("test-category-slug");
            expect(updatedCategory.image_url).toBe("test-image-url");
            expect(updatedCategory.description).toBe("test-category-description");
        });
    });

    describe("deleteHard", () => {
        it("Should return 0 deletedCount if category doesn't exist", async () => {
            let result: any = await CategoryDAL.deleteHard({ _id: mongoose.Types.ObjectId().toString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete category if it exists", async () => {
            let category = await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();

            let result: any = await CategoryDAL.deleteHard({ _id: category._id.toString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null category is passed", async () => {
            let category: ICategory = await CategoryDAL.deleteSoft(null);
            expect(category).toBeNull();
        });

        it("Should soft delete category if it exists", async () => {
            let category = await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();

            let deletedCategory: ICategory = await CategoryDAL.deleteSoft(category);
            expect(deletedCategory).not.toBeNull();
            expect(deletedCategory.name).toBe("test-category");
            expect(deletedCategory.slug).toBe("test-category");
            expect(deletedCategory.image_url).toBe("test-image-url");
            expect(deletedCategory.description).toBe("test-category-description");
            expect(deletedCategory.deleted_at).toBeTruthy();
        });
    });

    afterEach(async () => {
        await Category.deleteMany({ name: "test-category "});
    });

});