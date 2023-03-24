import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';

export const redisClient = createClient({ legacyMode: true }); // { legacyMode: true }
export const prismaClient = new PrismaClient();