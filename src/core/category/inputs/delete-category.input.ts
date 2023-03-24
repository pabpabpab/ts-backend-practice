import { Field, ID, InputType } from 'type-graphql';
import {IsInt, IsNumberString} from 'class-validator';
import {Category} from "../models/category.model";

@InputType()
export class DeleteCategoryInput implements Partial<Category> {
    @Field(() => ID)
    @IsNumberString()
    id: number;
}