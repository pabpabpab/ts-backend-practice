import { Resolver, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import { User } from '../models/user.model';
import { CreateUserInput } from '../inputs/create-user.input';
import { RootUserResolver } from './root-user.resolver';
import { LoginUserInput } from '../inputs/login-user.input';
import { MyContext } from '../../../common/types/my-context';
import { ConfirmUserInput } from '../inputs/confirm-user.input';
import { ForgotPasswordInput } from '../inputs/forgot-password.input';
import { ChangePasswordInput } from '../inputs/change-password.input';
import { UploadInput } from '../../../common/types/upload-input';
import { UploadResult } from '../../../common/types/upload-result';
import { MyScalarUploads } from '../../../common/types/my-scalar-uploads';
import { multipleUpload } from '../../../common/utils/upload/multiple-upload';
import { ROOT_IMG_FOLDER, USER_IMG_FOLDER } from '../../../common/config';
import {UserSession} from "../../../common/types/user-session-data";



@Resolver(() => User)
export class UserMutationResolver extends RootUserResolver{
    @Authorized()
    @Mutation(() => [UploadResult])
    async multipleUpload(
        @Arg("files", () => MyScalarUploads) files: UploadInput[],
        @Ctx() ctx: MyContext
    ): Promise<UploadResult[]> {
        const { userId = '0' } = <UserSession>ctx.req.session;
        return await multipleUpload({
            rootFolder: ROOT_IMG_FOLDER,
            targetFolder: USER_IMG_FOLDER,
            filePrefix: String(userId),
            files,
        });
    }

    @Mutation(() => User)
    async createUser(@Arg("input") input: CreateUserInput): Promise<User> {
        return await this.service.createUser(input);
    }

    @Mutation(() => Boolean)
    async confirmUser(@Arg("input") { token }: ConfirmUserInput): Promise<Boolean> {
        return await this.service.confirmUser({ token });
    }

    @Mutation(() => Boolean)
    async forgotPassword(@Arg("input") { email }: ForgotPasswordInput): Promise<Boolean> {
        return await this.service.forgotPassword({ email });
    }

    @Mutation(() => User, { nullable: true })
    async changePassword(
        @Arg("input") { token, password }: ChangePasswordInput,
        @Ctx() ctx: MyContext
    ): Promise<User | null> {
        return await this.service.changePassword({ token, password }, ctx);
    }

    @Mutation(() => User, { nullable: true })
    async loginUser(@Arg("input") input: LoginUserInput, @Ctx() ctx: MyContext): Promise<User | null> {
        return await this.service.loginUser(input, ctx);
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
        return this.service.logout(ctx);
    }
    // https://habr.com/ru/company/ruvds/blog/457700/
    // Руководство по аутентификации в Node.js без passport.js и сторонних сервисов




    // https://github.com/jaydenseric/graphql-multipart-request-spec
    // https://github.com/jaydenseric/graphql-upload/tree/v10.0.0#function-graphqluploadexpress
    // https://dev.to/lastnameswayne/implementing-image-uploading-with-type-graphql-apollo-and-typeorm-1c63
    // https://github.com/MichalLytek/type-graphql/issues/37
    // https://github.com/qaboxletstest/GraphQL-FileUpload
}


/*

    @Mutation(() => Boolean)
    async uploadUserPhoto(
        @Arg("fileInput", () => GraphQLUpload) fileInput: Upload,
        @Ctx() ctx: MyContext
    ): Promise<Boolean> {
        console.log('fileInput === ', JSON.stringify(fileInput))

        const { createReadStream, filename } = fileInput;

        let imgPath = path.join(process.cwd(), 'images', 'users', filename);

        console.log('imgPath ===', imgPath)

        return new Promise(async (resolve, reject) => {
            createReadStream()
                .pipe(createWriteStream(imgPath))
                .on('finish', () => resolve(true))
                .on('error', () => reject(false));
        });
    }
 */

/*
@InputType()
class MyUpload {
    @Field(() => String)
    filename: string;

    @Field(() => String)
    mimetype: string;

    @Field(() => String)
    encoding: string;

    @Field(() => String)
    createReadStream: () => Stream;
}
*/

