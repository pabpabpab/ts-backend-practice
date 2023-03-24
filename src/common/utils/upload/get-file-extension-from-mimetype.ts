export function getFileExtensionFromMimeType(mimetype: string): string {
    if (!mimetype) {
        return '';
    }
    const typeParts = mimetype.split('/');
    if (typeParts.length < 2) {
        return '';
    }
    const fileExtension = typeParts[1];
    if (['jpeg', 'pjpeg'].includes(fileExtension)) {
        return 'jpg';
    }
    return fileExtension;
}