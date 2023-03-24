import { PrismaClient } from '@prisma/client';
import { Task } from '../../models/task.model';
import { UpdateTaskInput } from '../../inputs/update-task.input';
import { getConnectCategoriesQuery } from './utils/get-connect-categories-query';
import { getTaskRelationsQuery } from './utils/get-task-relations-query';
import { extractCategoriesData } from './utils/extract-categories-data';

export async function updateTask(prisma: PrismaClient, input: UpdateTaskInput): Promise<Task> {
    const deleteOldCategoriesAssignments = prisma.categoriesOnTasks.deleteMany({
        where: {
            task: {
                id: Number(input.id)
            },
        },
    });

    // используя деструктуризацию получить свойство categories и остальную часть инпута
    const { id, categories, ...data } = input;

    // переделать инпут (добавить промежуточное поле create) для категорий
    // @ts-ignore
    data.categories = {
        create: getConnectCategoriesQuery(categories),
    }

    // @ts-ignore
    const updateTask = prisma.task.update({
        where: {
            id: Number(input.id),
        },
        data,
        include: getTaskRelationsQuery(), // выходные данные
    });

    const [
        deleteCategoriesAssignmentsResult,
        updateTaskResult
    ] = await prisma.$transaction([
        deleteOldCategoriesAssignments,
        updateTask
    ]);

    return {
        ...updateTaskResult,
        // @ts-ignore
        categories: extractCategoriesData(updateTaskResult.categories)
    }
}