import randomstring from 'randomstring';
import path from 'path';

type GetFilePathFunctionInput = {
    rootFolder: string;
    targetFolder: string;
    filePrefix: string;
    fileExtension: string;
}

type GetFilePathFunctionResult = {
    filePath: string;
    newFilename: string;
}

export function getFilepathForUpload(input: GetFilePathFunctionInput): GetFilePathFunctionResult {
    const { rootFolder, targetFolder, filePrefix, fileExtension } = input;

    const randomStr = randomstring.generate({ length: 10, capitalization: 'lowercase' });
    const newFilename = `${filePrefix}-${randomStr}.${fileExtension}`;
    return {
        filePath: path.join(process.cwd(), rootFolder, targetFolder, newFilename),
        newFilename
    };
}