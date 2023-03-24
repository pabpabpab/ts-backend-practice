import { Resolver, Mutation, Arg } from 'type-graphql';
import { Task } from '../models/task.model';
import { CreateTaskInput } from '../inputs/create-task.input';
import { UpdateTaskInput } from '../inputs/update-task.input';
import { DeleteTaskInput } from '../inputs/delete-task.input';
import { RootTaskResolver } from './root-task.resolver';
import { MyScalarUploads } from '../../../common/types/my-scalar-uploads';
import { UploadInput } from '../../../common/types/upload-input';


@Resolver(() => Task)
export class TaskMutationResolver extends RootTaskResolver{
    @Mutation(() => Task)
    async createTask(
        @Arg("input") input: CreateTaskInput,
        @Arg("files", () => MyScalarUploads, { nullable: true }) files?: UploadInput[]
    ): Promise<Task> {
        return await this.service.createTask(input, files);
    }

    @Mutation(() => Task)
    async updateTask(@Arg("input") input: UpdateTaskInput): Promise<Task> {
        return await this.service.updateTask(input);
    }

    @Mutation(() => Task)
    async deleteTask(@Arg("input") input: DeleteTaskInput): Promise<Task> {
        return await this.service.deleteTask(input);
    }
}