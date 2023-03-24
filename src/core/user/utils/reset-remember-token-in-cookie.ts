import { Response } from 'express';

export function resetRememberTokenInCookie(res: Response): void {
    res.clearCookie(String(process.env.REMEMBER_TOKEN_COOKIE_NAME));
}