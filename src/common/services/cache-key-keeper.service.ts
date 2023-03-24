import { PaginationArgs } from '../inputs/args';
import { Singleton } from '../decorators/singleton';

@Singleton
export class CacheKeyKeeperService {
    getUserByIdKey(id: number):string {
        return `user:id:${id}`;
    }

    getUserListKey({ skip, take }: PaginationArgs):string {
        return `user:list:skip:${skip}:take:${take}`;
    }

    getTaskListKey({ skip, take }: PaginationArgs):string {
        return `task:list:skip:${skip}:take:${take}`;
    }

    getTaskByIdKey(id: number):string {
        return `task:id:${id}`;
    }

    getCategoriesKey():string {
        return 'category:list';
    }

    getCategoryByIdKey(id: number):string {
        return `category:id:${id}`;
    }

    getCommentsByTaskIdKey(id: number):string {
        return `comments:by:taskId:${id}`;
    }
}