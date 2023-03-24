import { Field, InputType } from 'type-graphql';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginUserInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty({message: 'Enter password'})
    password: string;

    @Field({nullable: true})
    rememberMe?: string;
}