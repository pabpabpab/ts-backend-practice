import { RootCacheService } from '../../../common/services/root-cache.service';
import { ByIdArgs, PaginationArgs} from '../../../common/inputs/args';
import { UserDbService } from './user-db.service';
import { User } from '../models/user.model';
import { CreateUserInput } from '../inputs/create-user.input';
import { convertEntityDates } from '../../../common/utils/convert-entity-dates';
import { Singleton } from '../../../common/decorators/singleton';
import { PaginatedUserResponse } from '../responses/paginated-users.response';
import { LoginUserInput } from '../inputs/login-user.input';
import { MyContext } from '../../../common/types/my-context';
import { ConfirmUserInput } from '../inputs/confirm-user.input';
import { ForgotPasswordInput } from '../inputs/forgot-password.input';
import { ChangePasswordInput } from '../inputs/change-password.input';
import { UserSession } from '../../../common/types/user-session-data';

@Singleton
export class UserService extends RootCacheService {
    protected readonly db: UserDbService = new UserDbService();

    async createUser(input: CreateUserInput): Promise<User> {
        return this.db.createUser(input);
    }

    async confirmUser({ token }: ConfirmUserInput): Promise<Boolean> {
        return this.getCachedDataByKey(token)
            .then(async (userId) => {
                if (!userId) {
                    return false;
                }
                const result = await this.db.confirmUser(Number(userId));
                await this.redis.del(String(token));
                return Boolean(result);
            })
            .catch(() => false);
    }

    async forgotPassword({ email }: ForgotPasswordInput): Promise<Boolean> {
        return this.db.forgotPassword({ email });
    }

    async changePassword({ token, password }: ChangePasswordInput, ctx: MyContext): Promise<User | null> {
        return this.getCachedDataByKey(token)
            .then(async (userId) => {
                if (!userId) {
                    return null;
                }
                const user = await this.db.changePassword(Number(userId), password, ctx);
                await this.redis.del(String(token));
                return user;
            })
            .catch(() => null);
    }

    async loginUser(input: LoginUserInput, ctx: MyContext): Promise<User | null> {
        return this.db.loginUser(input, ctx);
    }

    async getMe(ctx: MyContext): Promise<User | null> {
        const { userId } = <UserSession>ctx.req.session;
        if (!userId) {
            return null;
        }
        return this.db.getUserById({ id: userId });
    }

    async logout(ctx: MyContext): Promise<Boolean> {
        const { userId } = <UserSession>ctx.req.session;
        if (!userId) {
            return false;
        }

        await this.db.resetRememberTokenInDb(Number(userId));
        ctx.res.clearCookie(String(process.env.REMEMBER_TOKEN_COOKIE_NAME));

        const prms = new Promise((res, rej) => {
            ctx.req.session!.destroy((err) => {
                if (err) {
                    console.log(err);
                    rej(false);
                }
                ctx.res.clearCookie(String(process.env.SESSION_COOKIE_NAME));
                res(true);
            });
        });
        return prms
            .then(() => true)
            .catch(() => false);
    }

    async getUserList(args: PaginationArgs): Promise<PaginatedUserResponse> {
        const cacheKey = this.keyKeeper.getTaskListKey(args);
        const { cached, data } = await this.cacheManager(cacheKey, this.db.getUserList.bind(this.db), args);
        if (cached) {
            data.items = data.items.map((entity: User) => convertEntityDates(entity));
        }
        return data;
    }
/*
    protected async getUserIdByToken(token: string): Promise<Boolean | number> {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            this.redis.get(token, (err, userId) => {
                if (!userId) {
                    reject(false);
                } else {
                    resolve(Number(userId));
                }
            });
        });
    }
*/
    /*
    async getUserById(args: ByIdArgs): Promise<User> {
        const cacheKey = this.keyKeeper.getUserByIdKey(Number(args.id));
        let { cached, data: user } = await this.cacheManager(cacheKey, this.db.getUserById.bind(this.db), args);
        if (cached) {
            // @ts-ignore
            user = convertEntityDates(user);
        }
        return user;
    }*/

    /*
    async updateUser(input: UpdateUserInput): Promise<User> {
        return this.db.updateTask(input);
    }

    async deleteUser(input: DeleteUserInput): Promise<User> {
        return this.db.deleteUser(input);
    }*/
}