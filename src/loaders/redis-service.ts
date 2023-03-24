import { redisClient } from '../clients';
import { Singleton } from '../common/decorators/singleton';

@Singleton
export class RedisService {
  private initErrorHandler(): void {
    redisClient.on('error', (err: any) => {
      console.log(`Redis errorr: ${err}`);
    });
  }

  async connect(): Promise<void> {
    this.initErrorHandler();
    await redisClient.connect();
  }
}
