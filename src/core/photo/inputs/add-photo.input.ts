/*
import { Field, InputType, Int } from 'type-graphql';
import { IsNumberString } from 'class-validator';
import { Photo } from '../models/photo.model';
@InputType()
export class AddPhotoInput implements Partial<Photo> {
    @Field(() => String)
    filename: string;

    @Field(() => Int, { nullable: true })
    @IsNumberString()
    taskId?: number;
}*/