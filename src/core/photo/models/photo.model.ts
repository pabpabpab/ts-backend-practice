import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Task } from '../../task/';

/*
By default, all fields are non nullable
 */

@ObjectType()
export class Photo {
    @Field(() => ID)
    id: number;

    @Field(() => Task)
    task: Task;

    @Field(() => Int)
    taskId: number;

    @Field(() => String)
    filename: string;
}