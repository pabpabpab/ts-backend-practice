import { ResolverData } from 'type-graphql';
import { UserDbService } from '../../core/user/services/user-db.service';
import { MyContext } from '../types/my-context';

export const MyAuthChecker = class ThisClass {
    private static db: UserDbService = new UserDbService();

    static async check({ root, args, context: ctx, info }: ResolverData<MyContext>, roles: string[]) {
        // @ts-ignore
        const { userId = undefined } = ctx.req.session;
        // нет сессии - отказать
        if (!userId) {
            throw new Error('Пожалуйста, авторизуйтесь');
        }
        // есть сессия и не указаны роли - разрешить
        if (roles.length === 0) {
            return true;
        }
        // есть сессия и указаны роли - считать user для проверки ролей
        const user = await ThisClass.db.getUserById({ id: userId });
        // если почему-то нет пользователя - отказать
        if (!user) {
            throw new Error('Пожалуйста, авторизуйтесь');
        }
        // есть сессия и указаны роли и роль пользователя входит в массив - разрешить
        if (roles.includes(user.role as string)) {
            return true;
        }
        // есть сессия и указаны роли и роль пользователя не входит в массив - отказать
        throw new Error('У вас нет прав для изменений или просмотра этого контента');
    }
}

/*
if (user.roles.some((role: string) => roles.includes(role))) {
    return true;
}
*/