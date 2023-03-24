import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { MyContext } from '../types/my-context';
import { UserDbService } from '../../core/user/services/user-db.service';
import { resetRememberTokenInCookie } from '../../core/user/utils/reset-remember-token-in-cookie';
import { getRememberTokenFromCookie } from '../../core/user/utils/get-remember-token-from-cookie';

export class AuthByRememberMeCookie implements MiddlewareInterface {
    constructor(private db: UserDbService = new UserDbService()) {}

    async use({ root, args, context, info }: ResolverData, next: NextFn) {
        const ctx = context as MyContext;
        // @ts-ignore
        if (ctx.req.session?.userId) {
            return next();
        }

        const encodedCookieToken = ctx.req.signedCookies[String(process.env.REMEMBER_TOKEN_COOKIE_NAME)];
        if (!encodedCookieToken) {
            return next();
        }

        const { userId, rememberToken } = getRememberTokenFromCookie(encodedCookieToken);

        if (userId < 1) {
            resetRememberTokenInCookie(ctx.res);
            return next();
        }

        const user = await this.db.loginUserByRememberToken(userId, rememberToken, ctx);

        if (!user) {
            resetRememberTokenInCookie(ctx.res);
            return next();
        }

        // @ts-ignore
        ctx.req.session.userId = user.id;

        return next();
    }
}