import {Field, Int, ObjectType} from 'type-graphql';

@ObjectType()
export class TaskRelationsAggregation {
    @Field(() => Int)
    photo: number;

    @Field(() => Int)
    comments: number;

    @Field(() => Int)
    categories: number;
}