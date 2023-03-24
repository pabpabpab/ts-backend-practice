import {Field, Int, ObjectType} from 'type-graphql';

@ObjectType()
export class AddPhotoInfoResponse {
    @Field(() => Int)
    count: number;
}