import 'reflect-metadata';
import express, {Request} from 'express';
import { graphqlHTTP } from 'express-graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import cookieParser from 'cookie-parser';
import {
    RedisService,
    createCorsMiddleware,
    createSessionMiddleware,
    GraphQLMiddlewareService
} from './loaders';
import { MyContext } from './common/types/my-context';


async function start(): Promise<void> {
    const PORT = process.env.BACKEND_PORT || 5000;
    const graphqlUri = '/graphql';

    await new RedisService().connect();

    const app = express();
    app.use(createCorsMiddleware());
    app.use(createSessionMiddleware());
    app.use(cookieParser(String(process.env.SIGNED_COOKIES_SECRET)));
    app.use(express.json()) // чтобы получить req.body для getComplexityRule()

    const gqlMiddlewareService = new GraphQLMiddlewareService();
    const { buildSchema, getComplexityRule, noIntrospectionRule } = gqlMiddlewareService
    const schema = await buildSchema();
    app.use(
        graphqlUri,
        graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
        graphqlHTTP((req, res) => {
            return {
                schema,
                context: { req, res } as MyContext,
                graphiql: true,
                validationRules: [getComplexityRule(req as Request)]
                //validationRules: [gqlMiddleware.noIntrospectionRule]
            }
        })
    );
    // https://github.com/graphql/express-graphql/blob/8b6ffc65776aa40d9e03f554425a1dc14840b165/README.md
    // https://stackoverflow.com/questions/57914065/how-to-extend-the-context-object-of-a-graphql-call
    // app.use(graphqlUri, await graphqlMiddleware.create());

    app.listen(PORT, () => {
        console.log(`Server has been started on http://localhost:${PORT}${graphqlUri}...`)
    });
}

start().catch((err) => {
    console.error(`Server start error: ${err}`);
    throw err;
});
