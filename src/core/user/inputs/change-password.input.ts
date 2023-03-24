import { Field, InputType } from 'type-graphql';
import { IsString, IsNotEmpty } from 'class-validator';
import { PasswordInput } from './password.input';

@InputType()
export class ChangePasswordInput extends PasswordInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    token: string;
}