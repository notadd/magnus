import { GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { BaseScalar } from './util';
class JsonScalar extends BaseScalar implements GraphQLScalarTypeConfig<any, object>{
    name: string = `Json`;
    description: string = `Json`;
    serialize(value: object) {
        return value
    }
    parseValue(value: any) {
        return value
    }
}
export const Json = new GraphQLScalarType(new JsonScalar());
