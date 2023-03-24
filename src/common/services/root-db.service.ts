import { prismaClient } from '../../clients';
import { PrismaClient } from '@prisma/client/scripts/default-index';

export default class RootDbService {
    protected readonly prisma: PrismaClient = prismaClient;
}