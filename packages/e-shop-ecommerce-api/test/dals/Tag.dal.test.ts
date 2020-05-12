import mongoose from 'mongoose';

import TagDAL from '../../src/dals/Tag.dal';
import Tag, { Tag as ITag } from '../../src/models/Tag';

import { createTag } from '../Generator';

const app = require("../../src/app");

describe("Tag.dal", () => {
        
    describe("create", () => {
        it("Should return error if required fields are not provieded!", async () => {
            try {
                await TagDAL.create(null, null, null);
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

        it("Should create tag!", async () => {
            let tag = await TagDAL.create("test-tag", "test-tag", "test-tag");
            expect(tag.name).toBe("test-tag");
            expect(tag.slug).toBe("test-tag");
            expect(tag.description).toBe("test-tag");
        });
    });

    describe("findMany", () => {
        it("Should return categories", async () => {
            await createTag("test-tag", "test-tag", "test-tag").save();

            let tags: ITag[] = await TagDAL.findMany({});
            expect(tags.length).toBeGreaterThan(0);
        });
    });

    describe("findOne", () => {
        it("Should return null if tag doesn't exist", async () => {
            let tag: ITag = await TagDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(tag).toBeNull();
        });

        it("Should return tag", async () => {
            let tag = await createTag("test-tag", "test-tag", "test-tag").save();

            let fetchedTag: ITag = await TagDAL.findOne({ _id: tag._id.toString() });
            expect(fetchedTag).not.toBeNull();
            expect(fetchedTag.name).toBe("test-tag");
            expect(fetchedTag.slug).toBe("test-tag");
            expect(fetchedTag.description).toBe("test-tag");
        });
    });

    describe("update", () => {
        it("Should return null if category doesn't exist", async () => {
            let tag: ITag = await TagDAL.update(null, {});
            expect(tag).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let tag = await createTag("test-tag", "test-tag", "test-tag").save();

            let updatedTag: ITag = await TagDAL.update(tag, {});
            expect(updatedTag).not.toBeNull();
            expect(updatedTag.name).toBe("test-tag");
            expect(updatedTag.slug).toBe("test-tag");
            expect(updatedTag.description).toBe("test-tag");
        });

        it("Shouldn update if tag description", async () => {
            let tag = await createTag("test-tag", "test-tag", "test-tag").save();

            let updatedTag: ITag = await TagDAL.update(tag, { description: "test-tag-2" });
            expect(updatedTag).not.toBeNull();
            expect(updatedTag.name).toBe("test-tag");
            expect(updatedTag.slug).toBe("test-tag");
            expect(updatedTag.description).toBe("test-tag-2");
        });
    });

    describe("deleteHard", () => {
        it("Should return 0 deletedCount if tag doesn't exist", async () => {
            let result: any = await TagDAL.deleteHard({ _id: mongoose.Types.ObjectId().toString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete tag if it exists", async () => {
            let tag = await createTag("test-tag", "test-tag", "test-tag").save();

            let result: any = await TagDAL.deleteHard({ _id: tag._id.toString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null tag is passed", async () => {
            let tag: ITag = await TagDAL.deleteSoft(null);
            expect(tag).toBeNull();
        });

        it("Should soft delete tag if it exists", async () => {
            let tag = await createTag("test-tag", "test-tag", "test-tag").save();

            let deletedTag: ITag = await TagDAL.deleteSoft(tag);
            expect(deletedTag).not.toBeNull();
            expect(deletedTag.name).toBe("test-tag");
            expect(deletedTag.slug).toBe("test-tag");
            expect(deletedTag.description).toBe("test-tag");
            expect(deletedTag.deleted_at).toBeTruthy();
        });
    });

    afterEach(async () => {
        await Tag.deleteMany({ name: "test-tag" });
    });

    afterAll(() => {
        mongoose.connection.close();
    });

});