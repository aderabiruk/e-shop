import mongoose from 'mongoose';

import { createCategory } from '../Generator';
import Messages from '../../src/errors/Messages';
import Category, { ICategory } from '../../src/models/Category';
import CategoryService from '../../src/services/Category.service';
import { IPaginationResponse } from '../../src/utilities/adapters/Pagination';

const app = require("../../src/app");

describe("Category.service", () => {
        
    describe("create", () => {
        it("Should return validation error if name is not provided", async () => {
            try {
                await CategoryService.create(null, null, null, null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                        message: Messages.CATEGORY_NAME_REQUIRED
                    })
                ]));
            }
        });

        it("Should return error if parent category doesn't exist", async () => {
            try {
                await CategoryService.create("test-category", mongoose.Types.ObjectId().toHexString(), null, null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "parent",
                        message: Messages.CATEGORY_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should return error if parent category id is invalid", async () => {
            try {
                await CategoryService.create("test-category", "INVALID-ID", null, null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "parent",
                        message: Messages.CATEGORY_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should create category without parent, image and description", async () => {
            let category: ICategory = await CategoryService.create("test-category", null, null, null);
            expect(category.name).toBe("test-category");
            expect(category.slug).toBeTruthy();
            expect(category.parent).toBeFalsy();
            expect(category.image_url).toBeFalsy();
        });

        it("Should create category with parent, image and description", async () => {
            let parent: ICategory = await createCategory("test-category-parent", "test-category-parent", null, "test-image-url", "test-category-parent-description").save();

            let category: ICategory = await CategoryService.create("test-category", parent._id, "category-image-url", "category-description");
            expect(category.name).toBe("test-category");
            expect(category.slug).toBeTruthy();
            expect(category.parent.toString()).toBe(parent._id.toString());
            expect(category.image_url).toBe("category-image-url");
            expect(category.description).toBe("category-description");
        });
    });

    describe("findAll", () => {
        it("Should return all categories", async () => {
            let category: ICategory = await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();

            let response: IPaginationResponse = await CategoryService.findAll();
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: category._id,
                    name: category.name,
                    slug: category.slug
                })
            ]));
        });

        it("Should filter categories", async () => {
            let category: ICategory = await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();

            let response: IPaginationResponse = await CategoryService.findAll("category");
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: category._id,
                    name: category.name,
                    slug: category.slug
                })
            ]));
        });

        it("Should paginate results", async () => {
            let category: ICategory = await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();

            let response: IPaginationResponse = await CategoryService.findAll("", 1, 5);
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(5);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: category._id,
                    name: category.name,
                    slug: category.slug
                })
            ]));
        });
    });

    describe("findParents", () => {
        it("Should return all parent categories", async () => {
            let category: ICategory = await createCategory("test-category", "test-category", null, "test-image-url", "test-category-description").save();

            let response: IPaginationResponse = await CategoryService.findParents();
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: category._id,
                    name: category.name,
                    slug: category.slug
                })
            ]));
        });

        it("Should paginate results", async () => {
            let category: ICategory = await createCategory("test-category", "test-category", null, "test-image-url", "test-category-description").save();

            let response: IPaginationResponse = await CategoryService.findParents(1, 5);
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(5);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: category._id,
                    name: category.name,
                    slug: category.slug
                })
            ]));
        });
    });

    describe("findSubcategories", () => {
        it("Should return all subcategories", async () => {
            let parent: ICategory = await createCategory("test-category-parent", "test-category-parent", null, "test-image-url", "test-category-parent-description").save();
            let category: ICategory = await createCategory("test-category", "test-category", parent._id, "test-image-url", "test-category-description").save();

            let response: IPaginationResponse = await CategoryService.findSubcategories(parent._id)
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);
            
            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: category._id,
                    name: category.name,
                    slug: category.slug
                })
            ]));
            expect(response.data).not.toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: parent._id,
                    name: parent.name,
                    slug: parent.slug
                })
            ]));
        });

        it("Should paginate results", async () => {
            let parent: ICategory = await createCategory("test-category-parent", "test-category-parent", null, "test-image-url", "test-category-parent-description").save();
            let category: ICategory = await createCategory("test-category", "test-category", parent._id, "test-image-url", "test-category-description").save();

            let response: IPaginationResponse = await CategoryService.findSubcategories(parent._id, 1, 5);
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(5);
            expect(response.metadata.pagination.numberOfPages).toBeGreaterThan(0);
            expect(response.metadata.pagination.numberOfResults).toBeGreaterThan(0);

            expect(response.data).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: category._id,
                    name: category.name,
                    slug: category.slug
                })
            ]));
            expect(response.data).not.toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: parent._id,
                    name: parent.name,
                    slug: parent.slug
                })
            ]));
        });
    });

    describe("findByID", () => {
        it("Should return null if id is invalid", async () => {
            let category: ICategory = await CategoryService.findByID("INVALID-ID");
            expect(category).toBeNull();
        });

        it("Should return null if category doesn't exist", async () => {
            let category: ICategory = await CategoryService.findByID(mongoose.Types.ObjectId().toHexString());
            expect(category).toBeNull();
        });

        it("Should return category if it exist", async () => {
            let category: ICategory = await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();

            let fetchedCategory: ICategory = await CategoryService.findByID(category._id);
            expect(category.name).toBe("test-category");
            expect(category.slug).toBe("test-category");
            expect(category.parent).toBeTruthy();
            expect(category.image_url).toBe("test-image-url");
            expect(category.description).toBe("test-category-description");
        });
    });

    describe("update", () => {
        it("Should return error if category doesn't exist", async () => {
            try {
                let category: ICategory = await CategoryService.update("INVALID-ID", {});
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(404);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    Messages.CATEGORY_NOT_FOUND
                ]));
            }
        });

        it("Should return error if parent category doesn't exist", async () => {
            let category: ICategory = await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();

            try {
                await CategoryService.update(category._id, { parent: "INVALID-ID" });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "parent",
                        message: Messages.CATEGORY_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should update name and slug", async () => {
            let category: ICategory = await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();

            let updatedCategory: ICategory = await CategoryService.update(category._id, { name: "New Category", description: "" });
            expect(updatedCategory.name).toBe("New Category");
            expect(updatedCategory.slug).toBe("new-category");
            expect(updatedCategory.description).toBe("");
        });
    });

    afterEach(async () => {
        await Category.deleteMany({ name: "test-category"});
        await Category.deleteMany({ name: "New Category"});
        await Category.deleteMany({ name: "test-category-parent"});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

});