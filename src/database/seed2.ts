import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const taskData: Prisma.TaskCreateInput[] = [
  {
    name: 'aaaaaaaaaaaaaaa1',
    description: 'bbbbbbbbbbbbb bbbbbbbbbb1',
  },
  {
    name: 'aaaaaaaaaaaaaaa2',
    description: 'bbbbbbbbbbbbb bbbbbbbbbb2',
    expires: new Date('12-30-2022'),
  },
  {
    name: 'aaaaaaaaaaaaaaa3',
    description: 'bbbbbbbbbbbbb bbbbbbbbbb3',
    expires: new Date('12-31-2022'),
    isCompleted: true,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  taskData.forEach(async (data) => {
    const task = await prisma.task.create({ data });
    console.log(`Created task with id: ${task.id}`);
    console.log(`with provided name: ${task.name}`);
  });
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
