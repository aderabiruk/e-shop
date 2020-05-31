import path from 'path';
import async from 'async';
import sharp from 'sharp';

type ImageSizeType = {
    label: string;
    width: number;
    height: number;
};

const ImageSizes: ImageSizeType[] = [
    { label: "xlg", width: 1200, height: 1200 },
    { label: "lg", width: 800, height: 800 },
    { label: "md", width: 600, height: 600 },
    { label: "sm", width: 400, height: 400 },
    { label: "xls", width: 100, height: 100 }
];

/**
 * Resize Image
 * 
 * @param {Express.Multer.File} image 
 */
const ImageResizer = (image: Express.Multer.File) => {
    return new Promise((resolve, reject) => {
        async.eachOfSeries(ImageSizes, (size: ImageSizeType, key: number, callback: Function) => {
            sharp(image.path).resize(size.width, size.height).toFile(path.resolve(image.destination, `${size.label}/${image.filename}`));
            callback();
        }, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(true);
            }
        });
    });
};

export default ImageResizer;