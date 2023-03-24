import { Resolver } from 'type-graphql';
import { TaskService } from '../services/task.service';
import { TaskDbService } from '../services/task-db.service';

@Resolver({ isAbstract: true })
export abstract class RootTaskResolver {
    protected readonly service: TaskService = new TaskService();
    protected readonly db: TaskDbService = new TaskDbService();
}