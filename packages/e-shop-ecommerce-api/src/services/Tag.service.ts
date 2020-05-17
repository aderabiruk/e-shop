import voca from 'voca';
import async from 'async';
import mongoose from 'mongoose';
import evalidate from 'evalidate';

import { ITag } from '../models/Tag';
import TagDAL from '../dals/Tag.dal';
import Messages from '../errors/Messages';
import { NotFoundError, BadRequestError, InternalServerError } from '../errors/Errors';
import { IPaginationResponse, PaginationAdapter } from '../utilities/adapters/Pagination';


class TagService {
    
    /**
     * Create Tag
     * 
     * @param {string} name
     * @param {string} description
     * 
     * @returns {Promise<ITag>}
     */
    static create(name: string, description: string): Promise<ITag> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    const Schema = new evalidate.schema({
                        name: evalidate.string().required(Messages.TAG_NAME_REQUIRED)
                    });
                    const result = Schema.validate({ name: name });
                    if (result.isValid) {
                        done(null);
                    }
                    else {
                        done(new BadRequestError(result.errors));
                    }
                },
                (done: Function) => {
                    let slug = voca.slugify(name);
                    TagDAL.create(name, slug, description)
                        .then((tag: ITag) => {
                            resolve(tag);
                        })
                        .catch((error: any) => {
                            done(new BadRequestError(error));
                        });
                }
            ], (error: any) => {
                if (error) {
                    reject(error);
                }
            })
        });
    }

    /**
     * Find All Tags
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findAll(page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            TagDAL.findMany({ deleted_at: null }, page, limit)
                .then((tags: ITag[]) => {
                    resolve(PaginationAdapter(tags, page, limit));
                })
                .catch((error) => {
                    reject(new InternalServerError(error));
                });

        });
    }

    /**
     * Find Tag By ID
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<ITag[]>}
     */
    static findByID(id: string): Promise<ITag> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                TagDAL.findOne({ _id: id })
                    .then((tag) => {
                        resolve(tag);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

    /**
     * Update Tag By ID
     * 
     * @param {string}  id 
     * @param {any}     payload 
     * 
     * @returns {Promise<ITag>}
     */
    static update(id: string, payload: any = {}): Promise<ITag> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    TagService.findByID(id)
                        .then((tag: ITag) => {
                            if (tag) {
                                done(null, tag);
                            }
                            else {
                                done(new NotFoundError(Messages.TAG_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (tag: ITag, done: Function) => {
                    TagDAL.update(tag, payload)
                        .then((updatedTag: ITag) => {
                            resolve(updatedTag);
                        })
                        .catch((error: any) => {
                            done(new BadRequestError(error));
                        })
                }
            ], (error: any) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }
};

export default TagService;