import { ObjectType, Field, ID } from 'type-graphql';
import { Task } from '../../task';
import { CategoryRelationsAggregation } from './category-aggregations.model';


@ObjectType()
export class Category {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    name: string;

    @Field(() => [Task])
    tasks: [Task]

    @Field(() => CategoryRelationsAggregation, { name: "relationsCount" })
    _count: CategoryRelationsAggregation;
}
