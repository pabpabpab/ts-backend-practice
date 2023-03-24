export function isAllowedMimeType(mimetype: string, allowedTypes: string): Boolean {
    if (!mimetype) {
        return false;
    }
    const allowedTypesArr = allowedTypes.split(',');
    const typeParts = mimetype.split('/');
    if (typeParts.length < 2) {
        return false;
    }
    const fileExtension = typeParts[1];
    return allowedTypesArr.includes(fileExtension);
}