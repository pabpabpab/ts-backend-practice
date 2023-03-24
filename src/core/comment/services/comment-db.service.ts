import RootDbService from '../../../common/services/root-db.service';
import { ByIdArgs } from '../../../common/inputs/args';
import { Singleton } from '../../../common/decorators/singleton';

@Singleton
export class CommentDbService extends RootDbService {
    async getCommentsByTaskId(args: ByIdArgs): Promise<Array<Comment>> {
        return this.prisma.comment.findMany({
            where: {
                taskId: Number(args.id),
            },
        });
    }
}