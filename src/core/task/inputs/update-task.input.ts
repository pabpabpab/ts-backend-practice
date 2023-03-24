import { Field, ID, InputType } from 'type-graphql';
import { IsNumberString, Length } from 'class-validator';
import { ConnectCategoryInput } from '../../category/inputs/connect-category.input';

@InputType()
export class UpdateTaskInput {
    @Field(() => ID)
    @IsNumberString()
    id: number;

    @Field({nullable: true})
    @Length(10, 50)
    name?: string;

    @Field({nullable: true})
    @Length(10, 1000)
    description?: string;

    @Field({nullable: true})
    isCompleted?: boolean;

    @Field(() => [ConnectCategoryInput])
    categories: [ConnectCategoryInput]
}