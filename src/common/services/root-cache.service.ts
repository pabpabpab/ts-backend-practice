import { redisClient } from '../../clients';
import { createClient } from 'redis';
import { CacheKeyKeeperService } from './cache-key-keeper.service';
import { cacheExpirationOption } from '../config';


export abstract class RootCacheService {
    protected readonly redis: ReturnType<typeof createClient> = redisClient;
    protected readonly keyKeeper: CacheKeyKeeperService = new CacheKeyKeeperService();
    protected readonly cacheExpirationOption: object = cacheExpirationOption;

    // Когда redisClient = createClient({ legacyMode: true });
    protected async cacheManager(cacheKey: string, dbServiceCb: Function, args: object = {}): Promise<any> {
        return this.getCachedDataByKey(cacheKey)
            .then(async (cachedData) => {
                if (cachedData) {
                    console.log('cache hit...');
                    return {
                        cached: true,
                        data: JSON.parse(cachedData as string),
                    };
                }

                console.log('cache miss...');
                const dbData = await dbServiceCb(args);
                const TTL = process.env.CACHE_EXPIRATION || '60'; // секунды
                await this.storeDataInCacheByKey(cacheKey, dbData, TTL);
                return {
                    cached: false,
                    data: dbData,
                };
            });
    }

    protected async getCachedDataByKey(key: string) {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            this.redis.get(key, (err, data) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(data);
                }
            });
        });
    }

    protected async storeDataInCacheByKey(key: string, data: object | null, ttl: string | number) {
        // @ts-ignore
        return await this.redis.set(key, JSON.stringify(data), 'EX', String(ttl));
    }

    // Когда redisClient = createClient(); // то есть без legacyMode
    protected async cacheManager2(cacheKey: string, dbServiceCb: Function, args: object = {}): Promise<any> {
        const cachedData = await this.redis.get(cacheKey);
        if (cachedData) {
            console.log('cache hit...');
            return {
                cached: true,
                data: JSON.parse(cachedData),
            };
        }

        const dbData = await dbServiceCb(args);

        await this.redis.set(cacheKey, JSON.stringify(dbData), this.cacheExpirationOption);
        console.log('cache miss...');
        return {
            cached: false,
            data: dbData,
        };
    }



}

/*
protected async cacheManager(dbServiceMethod: keyof BaseDbService, keyKeeperMethodName: keyof RedisKeyKeeper, args: object): Promise<object> {
    return await new Promise((resolve, reject) => {
        this.redis.get(redisKey, (err, data) => {
            if (err) return reject(err);
            if (data) return resolve(JSON.parse(data));
            const dbData = await dbServiceMethod(args);
            await this.redis.set(redisKey, JSON.stringify(dbData), this.redisEXOption);
            return resolve(dbData);
        });
    });
}*/