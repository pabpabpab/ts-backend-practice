import RootDbService from '../../../common/services/root-db.service';
import { Category } from '../models/category.model';
import { CreateCategoryInput } from '../inputs/create-category.input';
import { DeleteCategoryInput } from '../inputs/delete-category.input';
import { ByIdArgs } from '../../../common/inputs/args';
import { Singleton } from '../../../common/decorators/singleton';

@Singleton
export class CategoryDbService extends RootDbService {
    async getCategories(): Promise<Array<Category>> {
        const cats = await this.prisma.category.findMany({
            orderBy: {
                id: 'asc',
            },
            include: this.getCategoryRelationsQuery(),
        });
       //console.log(cats[0].tasks[0]);
        return cats.map((item: any) => {
            return {
                ...item,
                tasks: this.extractTasksData(item.tasks),
            }
        });
    }

    async getCategoryById(args: ByIdArgs): Promise<Category> {
        const category = await this.prisma.category.findUnique({
            where: { id: Number(args.id) },
            include: this.getCategoryRelationsQuery(), // включить relations в результат
        });
        //console.log(category.tasks[0].task)
        return {
            ...category,
            tasks: this.extractTasksData(category.tasks)
        };
    }

    async createCategory(input: CreateCategoryInput): Promise<Category> {
        return this.prisma.category.create({
            data: input
        });
    }

    async deleteCategory(input: DeleteCategoryInput): Promise<Category> {
        const taskCount = await this.prisma.task.count({
            where: {
                categories: {
                    some: {
                        category: {
                            id: Number(input.id)
                        }
                    }
                }
            }
        });

        if (taskCount > 0) {
            throw new Error("Категория содержит таски, удаление отменено.");
        }

        return this.prisma.category.delete({
            where: {
                id: Number(input.id)
            },
        });
    }

    protected getCategoryRelationsQuery(): object {
        return {
            _count: {
                select: { tasks: true },
            },
            tasks: { // здесь будет pivot таблица
                skip: 0, // ограничить кол-во подхватываемых task'ов
                take: 1,
                orderBy: {
                    taskId: 'desc',
                },
                include: {
                    task: { // включить конечные данные из таблицы task
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            _count: {
                                select: { comments: true },
                            },
                        },
                    },
                },
            },
        };
    }

    protected extractTasksData(tasksData: Array<object>): Array<object> {
        return tasksData.map((el: any) => {
            return {
                id: el.task.id,
                name: el.task.name,
                description: el.task.description,
                _count: el.task._count,
            };
        });
    }


}