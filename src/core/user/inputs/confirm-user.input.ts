import { Field, InputType } from 'type-graphql';
import { IsString, IsNotEmpty} from 'class-validator';

@InputType()
export class ConfirmUserInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    token: string;
}