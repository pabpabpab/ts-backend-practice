import { Resolver } from 'type-graphql';
import { CommentService } from '../services/comment.service';

@Resolver({ isAbstract: true })
export abstract class RootCommentResolver {
    protected readonly service: CommentService = new CommentService();
}