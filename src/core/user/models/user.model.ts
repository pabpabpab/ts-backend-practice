import { ObjectType, Field, ID } from 'type-graphql';
import { Task } from '../../task';
import { UserRelationsAggregation } from './user-aggregations.model';
import { Role } from './user-roles.model';
import { Profile } from './profile.model';

/*
By default, all fields are non nullable
 */

@ObjectType()
export class User {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    email: string;

    password: string;

    @Field(() => Boolean, { defaultValue: false })
    confirmed: boolean;

    @Field(() => Role, { nullable: true })
    role?: Role;

    @Field(() => Profile, { nullable: true })
    profile?: Profile;

    @Field(() => [Task], { nullable: true })
    tasks?: [Task];

    @Field(() => UserRelationsAggregation, { name: "relationsCount" })
    _count: UserRelationsAggregation;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    rememberToken?: string;
}


