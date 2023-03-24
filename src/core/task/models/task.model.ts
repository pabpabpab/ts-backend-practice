import { ObjectType, Field, ID } from 'type-graphql';
import { Comment } from '../../comment';
import { TaskRelationsAggregation } from './task-aggregations.model';
import { Category } from '../../category';
import { Photo } from '../../photo';

/*
By default, all fields are non nullable
 */

@ObjectType()
export class Task {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    description?: string;

    @Field(() => Date)
    expires: Date;

    @Field(() => Boolean, { defaultValue: false })
    isCompleted: boolean;

    @Field(() => [Category])
    categories: [Category];

    @Field(() => [Photo], { nullable: true })
    photo?: [Photo] | undefined;

    @Field(() => [Comment], { nullable: true })
    comments?: [Comment] | undefined;

    @Field(() => TaskRelationsAggregation, { name: "relationsCount" })
    _count: TaskRelationsAggregation;

    @Field(() => ID, { nullable: true })
    userId?: number | undefined;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}


