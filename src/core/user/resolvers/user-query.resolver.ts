import {Resolver, Query, Args, Ctx, Authorized} from 'type-graphql';
import { User } from '../models/user.model';
import { ByIdArgs, PaginationArgs } from '../../../common/inputs/args';
import { PaginatedUserResponse } from '../responses/paginated-users.response';
import { RootUserResolver } from './root-user.resolver';
import {MyContext} from "../../../common/types/my-context";
import { UploadInput } from "../../../common/types/upload-input";
import {GraphQLUpload, FileUpload, Upload} from 'graphql-upload';



@Resolver(() => User)
export class UserQueryResolver extends RootUserResolver {
    //@Authorized()
    @Query(() => PaginatedUserResponse)
    async getUserList(@Args() args: PaginationArgs): Promise<PaginatedUserResponse> {
        return this.service.getUserList(args);
    }

    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: MyContext): Promise<User | null> {
        return this.service.getMe(ctx);
    }

    /*
    @Query(() => User)
    async getUserById(@Args() args: ByIdArgs): Promise<User> {
        return this.service.getUserById(args);
    }*/
}
