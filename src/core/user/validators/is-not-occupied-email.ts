import { prismaClient as prisma } from '../../../clients';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsNotOccupiedEmailConstraint implements ValidatorConstraintInterface {
    async validate(email: string, args: ValidationArguments) {
        // console.log('email === ', email);
        // console.log('ValidationArguments --- ', args);
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        // console.log('result - ', user);
        return !user;
    }
}

export function IsNotOccupiedEmail(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNotOccupiedEmailConstraint,
        });
    };
}