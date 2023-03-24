import { RootCacheService } from '../../../common/services/root-cache.service';
import { ByIdArgs } from '../../../common/inputs/args';
import { CommentDbService } from './comment-db.service';
import { Singleton } from '../../../common/decorators/singleton';

@Singleton
export class CommentService extends RootCacheService {
    protected readonly db: CommentDbService = new CommentDbService();

    async getCommentsByTaskId(args: ByIdArgs): Promise<Array<Comment>> {
        const cacheKey = this.keyKeeper.getCommentsByTaskIdKey(Number(args.id));
        const { data } = await this.cacheManager(cacheKey, this.db.getCommentsByTaskId.bind(this.db), args);
        return data;
    }
}