import { Field, ID, InputType } from 'type-graphql';
import { Category } from '../models/category.model';
import { IsNumberString } from 'class-validator';

@InputType()
export class ConnectCategoryInput implements Partial<Category> {
    @Field(() => ID)
    @IsNumberString()
    id: number;
}