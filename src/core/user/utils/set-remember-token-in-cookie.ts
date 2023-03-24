import { Response } from 'express';

export function setRememberTokenInCookie(userId: number, tokenValue: string, res: Response): void {
    const fakeUserId = userId + Number(process.env.REMEMBER_TOKEN_SALT);
    const cookieTokenValue = tokenValue + String(fakeUserId);
    const encodedCookieTokenValue = Buffer.from(cookieTokenValue).toString('base64');

    res.cookie(
        String(process.env.REMEMBER_TOKEN_COOKIE_NAME),
        encodedCookieTokenValue,
        {
            expires: new Date(Date.now() + Number(process.env.REMEMBER_TOKEN_COOKIE_EXPIRATION)),
            httpOnly: true,
            signed: true,
        }
    );
}