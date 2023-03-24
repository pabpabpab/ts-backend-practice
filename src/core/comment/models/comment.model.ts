import {ObjectType, Field, ID, Root, Int} from 'type-graphql';
import { Task } from '../../task/';

/*
By default, all fields are non nullable
 */

@ObjectType()
export class Comment {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    content: string;

    @Field(() => Boolean, { nullable: true })
    published?: boolean = true;

    @Field(() => Task)
    task: Task;

    @Field(() => Int)
    taskId: number;

    @Field(() => Int)
    views: number;

    @Field(() => Int)
    likes: number;
}
