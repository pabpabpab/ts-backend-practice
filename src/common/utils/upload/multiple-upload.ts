import { UploadInput } from '../../types/upload-input';
import { UploadResult } from '../../types/upload-result';
import { isAllowedMimeType } from './is-allowed-mime-type';
import { createWriteStream } from 'fs';
import { getFileExtensionFromMimeType } from './get-file-extension-from-mimetype';
import { getFilepathForUpload } from './get-filepath-for-upload';


type MultipleUploadFunctionInput = {
    rootFolder: string;
    targetFolder: string;
    filePrefix: string;
    files: UploadInput[]
}

export async function multipleUpload(input: MultipleUploadFunctionInput): Promise<UploadResult[]> {
    const { rootFolder, targetFolder, filePrefix, files } = input;
    //console.log('files[0] === ', files[0]);

    const uploadedFiles = await Promise.allSettled(files);
    //console.log('uploadedFiles === ', uploadedFiles);

    const pipedStreams = uploadedFiles.map(async (uploadedOne: any, index: number) => {
        const { createReadStream = null, filename = '', mimetype = '' } = await uploadedOne.value.promise;
        //console.log('uploadedOne === ', uploadedOne);

        if (uploadedOne.status === 'rejected') {
            return filename || `${index + 1}-й файл`;
        }

        return new Promise((resolve, reject) => {
            if (!createReadStream || !filename || !mimetype) {
                return filename || `${index + 1}-й файл`;
            }

            if (!isAllowedMimeType(mimetype, String(process.env.ALLOWED_IMAGE_MIME_TYPES))) {
                return reject(filename);
            }

            const fileExtension = getFileExtensionFromMimeType(mimetype);
            if (!fileExtension) {
                return reject(filename);
            }

            const { filePath, newFilename } = getFilepathForUpload({
                rootFolder,
                targetFolder,
                filePrefix:`${filePrefix}-${index + 1}`,
                fileExtension
            });

            createReadStream()
                .pipe(createWriteStream(filePath, { autoClose: true }))
                .on('finish', () => resolve(newFilename))
                .on('error', () => reject(filename));
        });
    });

    const savingStreamsResult = await Promise.allSettled(pipedStreams);

    // console.log('savedStreams ===', savingStreamsResult);

    return savingStreamsResult as UploadResult[];
}