import { GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { BaseScalar } from './util';
class DoubleScalar extends BaseScalar implements GraphQLScalarTypeConfig<number, number> {
    name: string = `Double`
    description: string = `Double`;
    parseValue(value: number) {
        return value;
    }
    serialize(value: number): number {
        return value;
    }
}

export const Double = new GraphQLScalarType(new DoubleScalar())