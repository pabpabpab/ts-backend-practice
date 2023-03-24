import { GraphQLScalarType } from 'graphql';

export const MyScalarUploads = new GraphQLScalarType({
    name: 'MyUploads',
    parseValue(value) {
        return value;
    },
    parseLiteral(value) {
        return value;
    },
    serialize(value) {
        return value;
    }
});
