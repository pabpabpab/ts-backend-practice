import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import { Category } from '../models/category.model';

@InputType()
export class CreateCategoryInput implements Partial<Category> {
    @Field()
    @Length(5, 50)
    name: string;
}
