import session from 'express-session';
import connectRedis from 'connect-redis';
import { redisClient } from '../clients';

export function createSessionMiddleware(): any {
    const client = redisClient;

    const RedisStore = connectRedis(session);

    return session({
        store: new RedisStore({
            client
        }),
        name: process.env.SESSION_COOKIE_NAME || 'sid',
        secret: 'abcde1234567',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
        }
    });
}
