import { Field, InputType, Int } from 'type-graphql';
import { IsNumberString, Length } from 'class-validator';
import { Comment } from '../models/comment.model';
@InputType()
export class CreateCommentInput implements Partial<Comment> {
    @Field(() => String)
    @Length(2, 100)
    content: string;

    @Field(() => Int, { nullable: true })
    @IsNumberString()
    taskId?: number;
}