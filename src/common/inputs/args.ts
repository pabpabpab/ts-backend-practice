import { ArgsType, Field, ID, Int } from 'type-graphql';
import { IsNumberString, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
    @Field(() => Int, { defaultValue: 0 })
    @Min(0)
    skip: number = 0;

    @Field(() => Int)
    @Min(1)
    take: number;
}

@ArgsType()
export class ByIdArgs {
    @Field(() => ID)
    @IsNumberString()
    id: string;
}