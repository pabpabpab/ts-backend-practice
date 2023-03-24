import * as tq from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import { ErrorInterceptor } from '../common/middlewares/error-interceptor';
import { Singleton } from '../common/decorators/singleton';
import { MyAuthChecker } from '../common/middlewares/auth-checker';
import { AuthByRememberMeCookie } from '../common/middlewares/auth-by-remember-me-cookie';
import { createComplexityRule, simpleEstimator } from 'graphql-query-complexity';
import { Request} from 'express';

@Singleton
export class GraphQLMiddlewareService {
    async buildSchema(): Promise<GraphQLSchema> {
        const __dirname = process.cwd();
        return tq.buildSchema({
            resolvers: [__dirname + '/src/core/**/resolvers/*.ts'],
            globalMiddlewares: [AuthByRememberMeCookie, ErrorInterceptor],
            authChecker: MyAuthChecker.check as any,
            validate: true,
        });
    }

    noIntrospectionRule(context: any) {
        return {
            Field(node: any) {
                if (node.name.value === '__schema' || node.name.value === '__type') {
                    throw new Error('Im sorry');
                }
            }
        };
    }


    getComplexityRule(req: Request) {
        return createComplexityRule({
            estimators: [
                simpleEstimator({defaultComplexity: 1}),
            ],
            maximumComplexity: 1000,
            variables: req.body.variables,
            onComplete: (complexity: number) => {
                console.log('Query Complexity:', complexity);
            },
        });
    }
/*
    async create(): Promise<RequestHandler> {
        const schema = await this.buildSchema();
        return graphqlHTTP({
            schema,
            //context: { req: this.req },
            graphiql: true,
        });
    }*/
}
