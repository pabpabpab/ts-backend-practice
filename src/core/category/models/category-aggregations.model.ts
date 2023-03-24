import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class CategoryRelationsAggregation {
    @Field(() => Int)
    tasks: number;
}