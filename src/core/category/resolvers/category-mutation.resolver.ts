import { Resolver, Mutation, Arg } from 'type-graphql';
import { Category } from '../models/category.model';
import { CreateCategoryInput } from '../inputs/create-category.input';
import { DeleteCategoryInput } from '../inputs/delete-category.input';
import { RootCategoryResolver } from './root-category.resolver';


@Resolver(() => Category)
export class TaskMutationResolver extends RootCategoryResolver {
    @Mutation(() => Category)
    async createCategory(@Arg("input") input: CreateCategoryInput): Promise<Category> {
        return await this.service.createCategory(input);
    }

    @Mutation(() => Category)
    async deleteCategory(@Arg("input") input: DeleteCategoryInput): Promise<Category> {
        return await this.service.deleteCategory(input);
    }
}