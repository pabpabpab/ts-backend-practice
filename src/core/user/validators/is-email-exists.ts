import { prismaClient as prisma } from '../../../clients';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsEmailExistsConstraint implements ValidatorConstraintInterface {
    async validate(email: string, args: ValidationArguments) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        console.log('result - ', user);
        return Boolean(user);
    }
}

export function IsEmailExists(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailExistsConstraint,
        });
    };
}