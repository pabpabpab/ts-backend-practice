import RootDbService from '../../../common/services/root-db.service';
import { Task } from '../models/task.model';
import { CreateTaskInput } from '../inputs/create-task.input';
import { UpdateTaskInput } from '../inputs/update-task.input';
import { DeleteTaskInput } from '../inputs/delete-task.input';
import { ByIdArgs, PaginationArgs } from '../../../common/inputs/args';
import { PaginatedTaskResponse } from '../responses/paginated-tasks.response';
import { getTaskList } from './methods/get-task-list.method';
import { createTask } from './methods/create-task.method';
import { updateTask } from './methods/update-task.method';
import { deleteTask } from './methods/delete-task.method';
import { getTaskRelationsQuery } from './methods/utils/get-task-relations-query';
import { extractCategoriesData } from './methods/utils/extract-categories-data';
import { Singleton } from '../../../common/decorators/singleton';
import { Photo } from '../../photo';
import {AddPhotoInfoResponse} from "../../../common/types/add-photo-info-response";

@Singleton
export class TaskDbService extends RootDbService {
    async getTaskList({ skip, take }: PaginationArgs): Promise<PaginatedTaskResponse> {
        return getTaskList(this.prisma, { skip, take });
    }

    async getTaskById(args: ByIdArgs): Promise<Task> {
        const task = await this.prisma.task.findUnique({
            where: { id: Number(args.id) },
            include: getTaskRelationsQuery(), // включить relations в результат
        });
        return {
            ...task,
            categories: extractCategoriesData(task.categories)
        }
    }

    async createTask(input: CreateTaskInput): Promise<Task> {
        return createTask(this.prisma, input);
    }

    async updateTask(input: UpdateTaskInput): Promise<Task> {
        return updateTask(this.prisma, input);
    }

    async addPhotoInfo(filenames: string[], taskId: number): Promise<AddPhotoInfoResponse> {
        const data = filenames.map((filename) => ({ filename, taskId }));
        return await this.prisma.photo.createMany({ data });
    }

    async deleteTask(input: DeleteTaskInput): Promise<Task> {
        return deleteTask(this.prisma, input);
    }
}
