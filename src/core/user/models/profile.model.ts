import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Profile {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    bio: string;

    @Field(() => ID)
    userId: number;
}