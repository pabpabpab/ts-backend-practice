import { Category } from '../models/category.model';
import { CreateCategoryInput } from '../inputs/create-category.input';
import { DeleteCategoryInput } from '../inputs/delete-category.input';
import { RootCacheService } from '../../../common/services/root-cache.service';
import { CategoryDbService } from './category-db.service';
import { ByIdArgs } from '../../../common/inputs/args';
import { Singleton } from '../../../common/decorators/singleton';


@Singleton
export class CategoryService extends RootCacheService {
    protected readonly db: CategoryDbService = new CategoryDbService();

    async getCategories(): Promise<Array<Category>> {
        const cacheKey = this.keyKeeper.getCategoriesKey();
        const { data } = await this.cacheManager(cacheKey, this.db.getCategories.bind(this.db));
        return data;
    }

    async getCategoryById(args: ByIdArgs): Promise<Category> {
        const cacheKey = this.keyKeeper.getCategoryByIdKey(Number(args.id));
        const { data } = await this.cacheManager(cacheKey, this.db.getCategoryById.bind(this.db), args);
        return data;
    }

    async createCategory(input: CreateCategoryInput): Promise<Category> {
        return this.db.createCategory(input);
    }

    async deleteCategory(input: DeleteCategoryInput): Promise<Category> {
        return this.db.deleteCategory(input);
    }
}