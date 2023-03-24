import { Field, ID, InputType } from 'type-graphql';
import { Task } from '../models/task.model';
import { IsIdisId } from '../validators/myAsyncValidator';
import {IsInt, IsNotEmpty, IsNumberString, MaxLength} from 'class-validator';

@InputType()
export class DeleteTaskInput implements Partial<Task> {
    @Field(() => ID)
    @IsNumberString()
    id: number;

    /*
    @IsIdisId({message: 'xxxxxxxxx yyyyyyyy zzzzzzzz'})
    @IsInt({message: 'aaaaaaaaaa bbbbbbb cccccccc'})

    @MaxLength(3, {
        message: 'Title is too long. Maximal length is $constraint1 characters, but actual is $value',
    })
     */
}