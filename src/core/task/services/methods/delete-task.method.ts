import { PrismaClient } from '@prisma/client';
import { Task } from '../../models/task.model';
import { DeleteTaskInput } from '../../inputs/delete-task.input';

export async function deleteTask(prisma: PrismaClient, input: DeleteTaskInput): Promise<Task> {
    const deleteCategoriesAssignments = prisma.categoriesOnTasks.deleteMany({
        where: {
            task: {
                id: Number(input.id)
            },
        },
    });
    const deleteComments = prisma.comment.deleteMany({
        where: {
            taskId: Number(input.id)
        },
    });
    const deleteTask = prisma.task.delete({
        where: {
            id: Number(input.id)
        },
    });
    const [
        deleteCategoriesAssignmentsResult,
        deleteCommentsResult,
        deleteTaskResult
    ] = await prisma.$transaction([
        deleteCategoriesAssignments,
        deleteComments,
        deleteTask
    ]);

    return <Task>deleteTaskResult;
}