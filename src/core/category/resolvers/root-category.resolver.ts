import { Resolver } from 'type-graphql';
import { CategoryService } from '../services/category.service';


@Resolver({ isAbstract: true })
export abstract class RootCategoryResolver {
    protected readonly service: CategoryService = new CategoryService();
}