import { GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { BaseScalar } from './util';
import { Timestamp as TypeormTimestamp } from 'typeorm';
class TimestampScalar extends BaseScalar implements GraphQLScalarTypeConfig<any, object>{
    name: string = `Timestamp`;
    description: string = `Timestamp`;
    serialize(value: number): TypeormTimestamp {
        return TypeormTimestamp.fromInt(value);
    }
    parseValue(value: TypeormTimestamp): string {
        return value.toString();
    }
}
export const Timestamp = new GraphQLScalarType(new TimestampScalar())
