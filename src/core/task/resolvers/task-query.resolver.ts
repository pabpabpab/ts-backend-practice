import { Resolver, Query, Args, Ctx } from 'type-graphql';
import { Task } from '../models/task.model';
import { ByIdArgs, PaginationArgs } from '../../../common/inputs/args';
import { PaginatedTaskResponse } from '../responses/paginated-tasks.response';
import { RootTaskResolver } from './root-task.resolver';

@Resolver(() => Task)
export class TaskQueryResolver extends RootTaskResolver {
    @Query(() => PaginatedTaskResponse)
    async getTaskList(@Args() args: PaginationArgs): Promise<PaginatedTaskResponse> {
        return this.service.getTaskList(args);
    }

    @Query(() => Task)
    async getTaskById(@Args() args: ByIdArgs): Promise<Task> {
        return this.service.getTaskById(args);
    }

    /*
    @Query(() => Task)
    async getTaskById(@Arg('id') id: ID): Promise<Task> {
        return this.taskService.getTaskById(id);
    }*/

    /*
    @FieldResolver()
    async comments(@Root() task: Task): Promise<Comment[] | null> {
        return this.commentService.getCommentsByTaskId(task.id);
    }*/

    /*
    async tasks(@Ctx() ctx: any): Promise<Task[]> {
        // console.log(ctx.req.baseUrl)
        return this.service.getTasks();
    }

    @Query(() => [Task])
    async getTaskList(@Args() { skip, take }: PaginationArgs): Promise<Task[]> {
        return this.taskService.getTaskList({ skip, take });
    }*/
}
