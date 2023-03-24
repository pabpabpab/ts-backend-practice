import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import RootDbService from '../../../common/services/root-db.service';
import { User } from '../models/user.model';
import { CreateUserInput } from '../inputs/create-user.input';
import { ByIdArgs, PaginationArgs } from '../../../common/inputs/args';
import { Singleton } from '../../../common/decorators/singleton';
import { PaginatedUserResponse } from "../responses/paginated-users.response";
import { LoginUserInput } from '../inputs/login-user.input';
import { MyContext } from '../../../common/types/my-context';
import { sendEmail } from '../../../common/utils/send-email';
import { createConfirmationUrl } from '../utils/create-confirmation-url';
import { ForgotPasswordInput } from '../inputs/forgot-password.input';
import { createChangePasswordUrl } from '../utils/create-change-password-url';
import { setRememberTokenInCookie } from '../utils/set-remember-token-in-cookie';

@Singleton
export class UserDbService extends RootDbService {
    async createUser({ name, email, password }: CreateUserInput): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await this.prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        await sendEmail(email, await createConfirmationUrl(user.id));

        return user;
    }

    async confirmUser(userId: number): Promise<Boolean> {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { confirmed: true },
        });
        return Boolean(user);
    }

    async forgotPassword({ email }: ForgotPasswordInput): Promise<Boolean> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return true;
        }
        await sendEmail(email, await createChangePasswordUrl(user.id));
        return true;
    }

    async changePassword(userId: number, password: string, ctx: MyContext): Promise<User | null> {
        let user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return null;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        user = await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        if (user?.id) {
            // @ts-ignore
            ctx.req.session!.userId = user.id;
        }
        return <User | null>user;
    }

    async loginUser({ email, password, rememberMe = '' }: LoginUserInput, ctx: MyContext): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return null;
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return null;
        }
        /*
        if (!user.confirmed) {
            return null;
        }
        */
        // @ts-ignore
        ctx.req.session!.userId = user.id;

        if (rememberMe) {
            const tokenValue = randomstring.generate(Number(process.env.REMEMBER_TOKEN_LEN));
            if (await this.setRememberTokenInDb(user.id, tokenValue)) {
                setRememberTokenInCookie(user.id, tokenValue, ctx.res);
            }
        } else if (user.rememberToken) {
            await this.resetRememberTokenInDb(user.id);
        }

        return user;
    }

    async setRememberTokenInDb(userId: number, tokenValue: string): Promise<Boolean> {
        return !!await this.prisma.user.update({
            where: { id: userId },
            data: { rememberToken: tokenValue },
        });
    }

    async resetRememberTokenInDb(userId: number): Promise<Boolean> {
        return !!await this.prisma.user.update({
            where: { id: userId },
            data: { rememberToken: '' },
        });
    }

    async loginUserByRememberToken(userId: number, rememberToken: string = '', ctx: MyContext): Promise<User | null> {
        if (!rememberToken) {
            return null;
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return null;
        }
        if (!user.rememberToken) {
            return null;
        }
        if (user.rememberToken !== rememberToken) {
            await this.resetRememberTokenInDb(user.id);
            return null;
        }
        /*
        // Обновить токен
        const newTokenValue = randomstring.generate(Number(process.env.REMEMBER_TOKEN_LEN));
        if (await this.setRememberTokenInDb(user.id, newTokenValue)) {
            setRememberTokenInCookie(user.id, newTokenValue, ctx.res);
        }
        */
        return user;
    }

    async getUserList({ skip, take }: PaginationArgs): Promise<PaginatedUserResponse> {
        const total = await this.prisma.user.count();
        let items = await this.prisma.user.findMany({
            skip,
            take,
            orderBy: {
                id: 'desc',
            },
        });

        return {
            // @ts-ignore
            items,
            page: Math.ceil((skip + 1)/take),
            pageCount: Math.ceil(total/take),
            total,
            perPage: take,
            hasMore: total > skip + take,
        };
    }

    async getUserById(args: ByIdArgs): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: Number(args.id) },
        });
        if (!user) {
            return null;
        }
        return user;
    }

}