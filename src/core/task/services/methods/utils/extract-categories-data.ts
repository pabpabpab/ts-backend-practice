export function extractCategoriesData(categoriesData: Array<object>): Array<object> {
    return categoriesData.map((el: any) => {
        return {
            id: el.category.id,
            name: el.category.name,
        };
    });
}