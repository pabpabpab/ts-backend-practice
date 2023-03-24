import { ConnectCategoryInput } from '../../../../category/inputs/connect-category.input';

export function getConnectCategoriesQuery(categoriesInput: ConnectCategoryInput[]): Array<object> {
    return categoriesInput.map((item) => {
        return {
            assignedAt: new Date(),
            category: {
                connect: {
                    id: Number(item.id),
                },
            }
        }
    });
}