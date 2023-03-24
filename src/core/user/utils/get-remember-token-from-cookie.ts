export function getRememberTokenFromCookie(encodedCookieToken: string): UserRememberTokenInfo {
    const decodedCookieToken = Buffer.from(encodedCookieToken, 'base64').toString('ascii');

    const tokenLen = Number(process.env.REMEMBER_TOKEN_LEN);
    const rememberToken = decodedCookieToken.slice(0, tokenLen);

    const fakeUserId = decodedCookieToken.slice(tokenLen);
    const userId = Number(fakeUserId) - Number(process.env.REMEMBER_TOKEN_SALT);

    return { userId, rememberToken };
}

type UserRememberTokenInfo = {
    userId: number,
    rememberToken: string
}