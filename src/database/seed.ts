import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const data = Array.from({ length: 1 }).map(() => ({
    name: faker.name.firstName(),
    description: faker.name.lastName(),
}));
//console.log(data);

const prisma = new PrismaClient();

async function main() {
    await prisma.task.createMany({
        data
    });

    const noCommentedTasks = await prisma.task.findMany({
        where: {
            comments: {
                none: {}
            }
        }
    });
    /*
    const noCommentedTasks = await prisma.task.findMany({
        include: {
            comments: true
        }
    });*/

    // console.log(noCommentedTasks)


    noCommentedTasks.forEach(async (task) => {
        await prisma.comment.createMany({
            data: [
                {
                    content: faker.company.name(),
                    taskId: task.id
                },
                {
                    content: faker.company.name(),
                    taskId: task.id
                }
            ]
        });
    });
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });

/*
package.json
-------------
"prisma": {
    "seed": "ts-node src/database/seed.ts"
  },

cli
----------------
npx prisma db seed
 */
