import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import Logger from './../utils/logger';

export class ErrorInterceptor implements MiddlewareInterface {
    constructor(private readonly logger: Logger = new Logger()) {}

    async use(resolverData: ResolverData, next: NextFn) {
        //console.log(resolverData)
        return next()
            .catch((err) => {
                if (err?.validationErrors?.length > 0) {
                    const details = this.parseValidationErrors(err.validationErrors);
                    err.message = `${err.message}: ${details.join(';')}`;
                }
                this.logError(err, resolverData);
                throw err;
            });
    }

    protected parseValidationErrors(errors: object[]): string[] {
        const details = errors.map((item: any) => {
            return item?.constraints
                ? Object.values(item.constraints).join('; ')
                : '';
        });
        return details;
    }

    protected async logError(err: any, { root, args, context, info }: ResolverData): Promise<void> {
        const errorInfo = [];
        errorInfo.push(`Ошибка:\r\n`);
        errorInfo.push(`    Текст ошибки: ${err.message}\r\n`);
        errorInfo.push(`    Где: ${info.path.typename} "${info.path.key}" (поле "${info.fieldName})"\r\n`);
        errorInfo.push(`    Аргументы: ${JSON.stringify(args)}\r\n`);
        await this.logger.logToFile(errorInfo.join(''));
    }
}


