import { Field, InputType } from 'type-graphql';
import { IsEmail, Length } from 'class-validator';
import { IsNotOccupiedEmail } from '../validators/is-not-occupied-email';
import {PasswordInput} from "./password.input";

@InputType()
export class CreateUserInput extends PasswordInput  {
    @Field()
    @Length(1, 50)
    name: string;

    @Field()
    @IsNotOccupiedEmail({message: 'Is an occupied email address'})
    @IsEmail()
    email: string;
}
