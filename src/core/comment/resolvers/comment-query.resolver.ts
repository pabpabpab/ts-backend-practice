import { Resolver, Root, FieldResolver } from 'type-graphql';
import { Task } from '../../task/models/task.model';
import { Comment } from '../models/comment.model';
import { RootCommentResolver } from './root-comment.resolver';

@Resolver(() => Comment)
export class CommentQueryResolver extends RootCommentResolver {
    /*
    @FieldResolver()
    async task(@Root() comment: Comment): Promise<Task> {
        return this.taskService.getTaskById({ id: String(comment.taskId) });
    }*/
}