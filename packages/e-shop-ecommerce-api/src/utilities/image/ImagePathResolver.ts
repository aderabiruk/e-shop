import path from 'path';
import async from 'async';

export type ImagePath = {
    xls: string;
    sm: string;
    md: string;
    lg: string;
    xlg: string;
    original: string;
};

/**
 * Image Path Resolver
 * 
 * @param {any} images
 */
const ImagePathResolver = (images: any): Promise<ImagePath[]> => {
    let paths: ImagePath[] = [];

    return new Promise((resolve, reject) => {
        async.eachOfSeries(images, (file: Express.Multer.File, key: number, callback: Function) => {
            paths.push({
                original: file.path,
                xlg: path.join(file.destination, "xlg", file.filename),
                lg: path.join(file.destination, "lg", file.filename),
                md: path.join(file.destination, "md", file.filename),
                sm: path.join(file.destination, "sm", file.filename),
                xls: path.join(file.destination, "xls", file.filename)
            })            
            callback();
        }, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(paths);
            }
        });
    });
};

export default ImagePathResolver;