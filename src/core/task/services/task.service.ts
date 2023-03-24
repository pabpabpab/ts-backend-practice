import { RootCacheService } from '../../../common/services/root-cache.service';
import { ByIdArgs, PaginationArgs } from '../../../common/inputs/args';
import { TaskDbService } from './task-db.service';
import { PaginatedTaskResponse } from '../responses/paginated-tasks.response';
import { Task } from '../models/task.model';
import { CreateTaskInput } from '../inputs/create-task.input';
import { UpdateTaskInput } from '../inputs/update-task.input';
import { DeleteTaskInput } from '../inputs/delete-task.input';
import { convertEntityDates } from '../../../common/utils/convert-entity-dates';
import { Singleton } from '../../../common/decorators/singleton';
import { UploadInput } from '../../../common/types/upload-input';
import { multipleUpload } from '../../../common/utils/upload/multiple-upload';
import { ROOT_IMG_FOLDER, TASK_IMG_FOLDER } from '../../../common/config';
import { UploadResult } from '../../../common/types/upload-result';

@Singleton
export class TaskService extends RootCacheService {
    protected readonly db: TaskDbService = new TaskDbService();

    async getTaskList(args: PaginationArgs): Promise<PaginatedTaskResponse> {
        const cacheKey = this.keyKeeper.getTaskListKey(args);
        const { cached, data } = await this.cacheManager(cacheKey, this.db.getTaskList.bind(this.db), args);
        if (cached) {
            data.items = data.items.map((entity: Task) => convertEntityDates(entity));
        }
        return data;
    }

    async getTaskById(args: ByIdArgs): Promise<Task> {
        const cacheKey = this.keyKeeper.getTaskByIdKey(Number(args.id));
        let { cached, data: task } = await this.cacheManager(cacheKey, this.db.getTaskById.bind(this.db), args);
        if (cached) {
            // @ts-ignore
            task = convertEntityDates(task);
        }
        return task;
    }

    async createTask(input: CreateTaskInput, files: UploadInput[] | null = null): Promise<Task> {
        const task = await this.db.createTask(input);
        if (!files) {
            return task;
        }

        const uploadResult: UploadResult[] = await multipleUpload({
            rootFolder: ROOT_IMG_FOLDER,
            targetFolder: TASK_IMG_FOLDER,
            filePrefix: String(task.id),
            files,
        });

        const filenames = uploadResult.map((item) => {
            if (item.status === 'fulfilled') {
                return String(item.value);
            }
        });

        const { count: photoCount = 0 } = await this.db.addPhotoInfo(filenames as string[], task.id);

        if (!photoCount) {
            return task;
        }

        return this.db.getTaskById({ id: String(task.id) });
    }

    async updateTask(input: UpdateTaskInput): Promise<Task> {
        return this.db.updateTask(input);
    }

    async deleteTask(input: DeleteTaskInput): Promise<Task> {
        return this.db.deleteTask(input);
    }
}