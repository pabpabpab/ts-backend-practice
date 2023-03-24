import {ObjectType, Field, Int, ClassType} from 'type-graphql';

export function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
    @ObjectType({ isAbstract: true })
    abstract class PaginatedResponseClass {
        // here we use the runtime argument
        @Field(() => [TItemClass])
        // and here the generic type
        items: TItem[];

        @Field(() => Int)
        page: number;

        @Field(() => Int)
        pageCount: number;

        @Field(() => Int)
        total: number;

        @Field(() => Int)
        perPage: number;

        @Field(() => Boolean)
        hasMore: boolean;
    }
    return PaginatedResponseClass;
}
