import {Field, ID, InputType} from 'type-graphql';
import { Length } from 'class-validator';
import { CreateCommentInput } from '../../comment/inputs/create-comment.input';
import { ConnectCategoryInput } from '../../category/inputs/connect-category.input';

@InputType()
export class CreateTaskInput {
    @Field()
    @Length(5, 50)
    name: string;

    @Field({ nullable: true })
    @Length(5, 1000)
    description?: string;

    @Field({ nullable: true })
    isCompleted?: boolean = false;

    @Field(() => [ConnectCategoryInput])
    categories: [ConnectCategoryInput]

    @Field(() => [CreateCommentInput], { nullable: true })
    comments?: [CreateCommentInput] | undefined

    //@Field(() => ID, { defaultValue: 0 })
    //userId: number;
}