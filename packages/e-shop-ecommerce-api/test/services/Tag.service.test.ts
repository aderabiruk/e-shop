import mongoose from 'mongoose';

import { createTag } from '../Generator';
import Messages from '../../src/errors/Messages';
import Tag, { ITag } from '../../src/models/Tag';
import TagService from '../../src/services/Tag.service';
import { IPaginationResponse } from '../../src/utilities/adapters/Pagination';

const app = require("../../src/app");

describe("Tag.service", () => {
        
    describe("create", () => {
        it("Should return validation error if name is not provided", async () => {
            try {
                await TagService.create(null, null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                        message: Messages.TAG_NAME_REQUIRED
                    })
                ]));
            }
        });

        it("Should create tag ", async () => {
            let tag = await TagService.create("test-tag", "test-tag");
            expect(tag.name).toBe("test-tag");
            expect(tag.slug).toBe("test-tag");
            expect(tag.description).toBe("test-tag");
        });

    });

    describe("findAll", () => {
        it("Should return tags", async () => {
            await createTag("test-tag", "test-tag", "test-tag").save();

            let response: IPaginationResponse = await TagService.findAll();
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
        });
    });

    describe("findByID", () => {
        it("Should return null if id is invalid", async () => {
            let tag: ITag = await TagService.findByID("INVALID-ID");
            expect(tag).toBeNull();
        });

        it("Should return null if tag doesn't exist", async () => {
            let tag: ITag = await TagService.findByID(mongoose.Types.ObjectId().toHexString());
            expect(tag).toBeNull();
        });

        it("Should return tag if it exist", async () => {
            let Tag: ITag = await createTag("test-tag", "test-tag", "test-tag").save();

            let fetchedTag: ITag = await TagService.findByID(Tag._id);
            expect(fetchedTag).not.toBeNull();
            expect(fetchedTag.name).toBe("test-tag");
            expect(fetchedTag.slug).toBe("test-tag");
            expect(fetchedTag.description).toBe("test-tag");
        });
    });

    describe("update", () => {
        it("Should return null if tag doesn't exist", async () => {
            try {
                let tag: ITag = await TagService.update(null, {});
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(404);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    Messages.TAG_NOT_FOUND
                ]));
            }
        });

        it("Shouldn't update if payload is empty", async () => {
            let tag: ITag = await createTag("test-tag", "test-tag", "test-tag").save();

            let updatedTag: ITag = await TagService.update(tag._id, {});
            expect(updatedTag).not.toBeNull();
            expect(updatedTag.name).toBe("test-tag");
            expect(updatedTag.slug).toBe("test-tag");
            expect(updatedTag.description).toBe("test-tag");
        });

        it("Shouldn update if tag description", async () => {
            let Tag: ITag = await createTag("test-tag", "test-tag", "test-tag").save();

            let updatedTag: ITag = await TagService.update(Tag._id, { description: 'test-tag-2' });
            expect(updatedTag).not.toBeNull();
            expect(updatedTag.name).toBe("test-tag");
            expect(updatedTag.slug).toBe("test-tag");
            expect(updatedTag.description).toBe("test-tag-2");
        });
    });

    afterEach(async () => {
        await Tag.deleteMany({ name: "test-tag"});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

});