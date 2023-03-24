import { Field, InputType } from 'type-graphql';
import { Length, Min } from 'class-validator';

@InputType()
export class PasswordInput {
    @Field()
    @Length(5, 100)
    password: string;
}