import { GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { BaseScalar } from './util';
class FloatScalar extends BaseScalar implements GraphQLScalarTypeConfig<number, number> {
    name: string = `Float`
    description: string = `Float`;
    parseValue(value: number) {
        return value;
    }
    serialize(value: number): number {
        return value;
    }
}
export const Float = new GraphQLScalarType(new FloatScalar())