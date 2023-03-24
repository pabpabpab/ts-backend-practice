import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class UserRelationsAggregation {
    @Field(() => Int)
    tasks: number;
}