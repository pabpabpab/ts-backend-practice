import { ObjectType } from 'type-graphql';
import { PaginatedResponse } from '../../../common/types/paginated-response';
import { Task } from '../models/task.model';

@ObjectType()
export class PaginatedTaskResponse extends PaginatedResponse(Task) {
    // we can freely add more fields or overwrite the existing one's types
    // @Field()
    // otherInfo: any;
}

/*
And then use it in our resolvers:

@Resolver()
class TaskResolver {
  @Query()
  tasks(): PaginatedTaskResponse {
    // here is your custom business logic,
    // depending on underlying data source and libraries
    return {
      items,
      page,
      pageCount,
      total,
      perPage,
      hasMore,
      otherInfo,
    };
  }
}
 */