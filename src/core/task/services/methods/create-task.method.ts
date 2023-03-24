import { PrismaClient } from '@prisma/client';
import { CreateTaskInput } from '../../inputs/create-task.input';
import { Task } from '../../models/task.model';
import { getConnectCategoriesQuery } from './utils/get-connect-categories-query';
import { getTaskRelationsQuery } from './utils/get-task-relations-query';
import { extractCategoriesData } from './utils/extract-categories-data';

export async function createTask(prisma: PrismaClient, input: CreateTaskInput): Promise<Task> {
    // используя деструктуризацию получить нижеуказанные свойства и остальную часть инпута
    const { categories, comments = undefined, ...data } = input;

    // переделать инпут (добавить промежуточное поле create) для категорий
    // @ts-ignore
    data.categories = {
        create: getConnectCategoriesQuery(categories),
    }

    // переделать инпут (добавить промежуточное поле createMany) если есть комментарии
    if (comments?.length) {
        // @ts-ignore
        data.comments = { createMany: { data: comments } }
    }

    // @ts-ignore
    const createTaskResult = await prisma.task.create({ data, include: getTaskRelationsQuery() }); // выходные данные

    return {
        ...createTaskResult,
        // @ts-ignore
        categories: extractCategoriesData(createTaskResult.categories)
    }
}