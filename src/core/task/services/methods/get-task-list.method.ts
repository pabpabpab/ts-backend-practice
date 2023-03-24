import { PaginationArgs } from '../../../../common/inputs/args';
import { PrismaClient } from '@prisma/client';
import { PaginatedTaskResponse } from '../../responses/paginated-tasks.response';
import { getTaskRelationsQuery } from './utils/get-task-relations-query';
import { extractCategoriesData } from './utils/extract-categories-data';

export async function getTaskList(prisma: PrismaClient, { skip, take }: PaginationArgs): Promise<PaginatedTaskResponse> {
    const total = await prisma.task.count();
    let items = await prisma.task.findMany({
        skip,
        take,
        orderBy: {
            id: 'desc',
        },
        include: getTaskRelationsQuery(), // включить relations в результат
    });

    // поднять вложенные данные в свойстве categories на уровень выше чтобы данные соответствовали модели Task
    items = items.map((item: any) => {
        return {
            ...item,
            categories: extractCategoriesData(item.categories),
        }
    });

    return {
        // @ts-ignore
        items,
        page: Math.ceil((skip + 1)/take),
        pageCount: Math.ceil(total/take),
        total,
        perPage: take,
        hasMore: total > skip + take,
    };
}