import { Field, ObjectType } from 'type-graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@ObjectType()
export class UploadResult {
    @Field(() => String)
    status: string;

    @Field(() => String, { nullable: true })
    value?: string;

    @Field(() => String, { nullable: true })
    reason?: string;
}


