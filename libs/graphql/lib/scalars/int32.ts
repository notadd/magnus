import { GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { BaseScalar } from './util';
class Int32Scalar extends BaseScalar implements GraphQLScalarTypeConfig<number, number> {
    name: string = `Int32`
    description: string = `Int32`;

    parseValue(value: number) {
        return value;
    }
    serialize(value: number): number {
        return value;
    }
}
export const Int32 = new GraphQLScalarType(new Int32Scalar());

/**
 * bigint
 */
class Int64Scalar extends BaseScalar implements GraphQLScalarTypeConfig<string, bigint> {
    name: string = `Int64`;
    description: string = `Int64`;
    parseValue(value: bigint): string {
        return value.toString();
    }
    serialize(value: string): bigint {
        return BigInt(value)
    }
}
export const Int64 = new GraphQLScalarType(new Int64Scalar());


class Uint32Scalar extends BaseScalar implements GraphQLScalarTypeConfig<number, number> {
    name: string = `Uint32`
    description: string = `Uint32`;
    parseValue(value: number) {
        return value;
    }
    serialize(value: number): number {
        return value;
    }
}
export const Uint32 = new GraphQLScalarType(new Uint32Scalar())
class Sint32Scalar extends BaseScalar implements GraphQLScalarTypeConfig<number, number> {
    name: string = `Sint32`
    description: string = `Sint32`;

    parseValue(value: number) {
        return value;
    }
    serialize(value: number): number {
        return value;
    }
}
export const Sint32 = new GraphQLScalarType(new Sint32Scalar())
class Fixed32Scalar extends BaseScalar implements GraphQLScalarTypeConfig<number, number> {
    name: string = `Fixed32`
    description: string = `Fixed32`;

    parseValue(value: number) {
        return value;
    }
    serialize(value: number): number {
        return value;
    }
}
export const Fixed32 = new GraphQLScalarType(new Fixed32Scalar())
class Sfixed32Scalar extends BaseScalar implements GraphQLScalarTypeConfig<number, number> {
    name: string = `Sfixed32`
    description: string = `Sfixed32`;

    parseValue(value: number) {
        return value;
    }
    serialize(value: number): number {
        return value;
    }
}
export const Sfixed32 = new GraphQLScalarType(new Sfixed32Scalar())
class Uint64Scalar extends BaseScalar implements GraphQLScalarTypeConfig<number, number> {
    name: string = `Uint64`
    description: string = `Uint64`;

    parseValue(value: number) {
        return value;
    }
    serialize(value: number): number {
        return value;
    }
}
export const Uint64 = new GraphQLScalarType(new Uint64Scalar())
class Sint64Scalar extends BaseScalar implements GraphQLScalarTypeConfig<number, number> {
    name: string = `Sint64`
    description: string = `Sint64`;

    parseValue(value: number) {
        return value;
    }
    serialize(value: number): number {
        return value;
    }
}
export const Sint64 = new GraphQLScalarType(new Sint64Scalar())
class Fixed64Scalar extends BaseScalar implements GraphQLScalarTypeConfig<number, number> {
    name: string = `Fixed64`
    description: string = `Fixed64`;

    parseValue(value: number) {
        return value;
    }
    serialize(value: number): number {
        return value;
    }
}
export const Fixed64 = new GraphQLScalarType(new Fixed64Scalar())

class Sfixed64Scalar extends BaseScalar implements GraphQLScalarTypeConfig<number, number> {
    name: string = `Sfixed64`
    description: string = `Sfixed64`;

    parseValue(value: number) {
        return value;
    }
    serialize(value: number): number {
        return value;
    }
}
export const Sfixed64 = new GraphQLScalarType(new Sfixed64Scalar())

class BoolScalar extends BaseScalar implements GraphQLScalarTypeConfig<boolean, boolean> {
    name: string = `Bool`
    description: string = `Bool`;

    parseValue(value: boolean) {
        return value;
    }
    serialize(value: boolean): boolean {
        return value;
    }
}
export const Bool = new GraphQLScalarType(new BoolScalar())

class BytesScalar extends BaseScalar implements GraphQLScalarTypeConfig<string, string> {
    name: string = `Bytes`
    description: string = `Bytes`;

    parseValue(value: string) {
        return value;
    }
    serialize(value: string): string {
        return value;
    }
}
export const Bytes = new GraphQLScalarType(new BytesScalar())

class EmptyScalar extends BaseScalar implements GraphQLScalarTypeConfig<{}, {}>{
    name: string = `Empty`
    description: string = `Empty`;

    parseValue(value: {}) {
        return value;
    }
    serialize(value: {}): {} {
        return value;
    }
}
export const Empty = new GraphQLScalarType(new EmptyScalar())

class ErrorScalar extends BaseScalar implements GraphQLScalarTypeConfig<any, any>{
    name: string = `Error`
    description: string = `Error`;

    parseValue(value: any) {
        return value;
    }
    serialize(value: any): {} {
        return value;
    }
}
export const Error = new GraphQLScalarType(new ErrorScalar())
