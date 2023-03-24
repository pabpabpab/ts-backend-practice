// ROUGH DRAFT

import { prismaClient as prisma } from '../../../clients';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsIdisIdConstraint implements ValidatorConstraintInterface {
    validate(id: string, args: ValidationArguments) {
        //console.log('ididid === ', id);
        //console.log('ValidationArguments --- ', args);
        return prisma.task.findMany()
            .then(items => {
                //console.log('items.length = ', items.length);
                if (items.length < 50) {
                    return false;
                }
                return true;
            });
    }
}

export function IsIdisId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsIdisIdConstraint,
        });
    };
}