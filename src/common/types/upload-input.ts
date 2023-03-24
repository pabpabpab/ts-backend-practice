import { Stream } from 'stream';

export type UploadInput = {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream;
}