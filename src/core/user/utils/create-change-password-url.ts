import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../../../clients';

export const createChangePasswordUrl = async (userId: number | string): Promise<string> => {
    const token = uuidv4();
    const TTL = process.env.CHANGE_PASSWORD_URL_EXPIRATION || '86400'; // секунды (86400 = сутки)
    // @ts-ignore
    await redisClient.set(token, String(userId), 'EX', TTL);
    return `${process.env.SITE_URL}/user/change-password/${token}`;
}