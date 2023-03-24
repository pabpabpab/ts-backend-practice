import { Resolver } from 'type-graphql';
import { UserService } from '../services/user.service';

@Resolver({ isAbstract: true })
export abstract class RootUserResolver {
    protected readonly service: UserService = new UserService();
}