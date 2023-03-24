export function getTaskRelationsQuery(): object {
    return {
        _count: {
            select: {
                photo: true,
                comments: true,
            },
        },
        photo: true,
        comments: true,
        categories: { // здесь будет pivot таблица
            include: {
                category: { // включить конечные данные из таблицы category
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
        },
    };
}