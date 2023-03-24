import {Resolver, Query, Args} from 'type-graphql';
import { Category } from '../models/category.model';
import { ByIdArgs } from '../../../common/inputs/args';
import { RootCategoryResolver } from './root-category.resolver';

@Resolver(() => Category)
export class CategoryQueryResolver extends RootCategoryResolver {
    @Query(() => [Category])
    async getCategories(): Promise<Array<Category>> {
        return this.service.getCategories();
    }

    @Query(() => Category)
    async getCategoryById(@Args() args: ByIdArgs): Promise<Category> {
        return this.service.getCategoryById(args);
    }
}
