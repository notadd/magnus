import { Kind, ValueNode, ObjectValueNode } from 'graphql';

export abstract class BaseScalar {
    parseObject(ast: ObjectValueNode, variables: any) {
        const value = Object.create(null);
        ast.fields.forEach((field: any) => {
            value[field.name.value] = this.parseLiteral(field.value, variables);
        });
        return value;
    }
    parseLiteral(ast: ValueNode, variables: any): any {
        switch (ast.kind) {
            case Kind.STRING:
            case Kind.BOOLEAN:
                return ast.value;
            case Kind.INT:
            case Kind.FLOAT:
                return parseFloat(ast.value);
            case Kind.OBJECT:
                return this.parseObject(ast, variables);
            case Kind.LIST:
                return ast.values.map((n: any) => this.parseLiteral(n, variables));
            case Kind.NULL:
                return null;
            case Kind.VARIABLE: {
                const name = ast.name.value;
                return variables ? variables[name] : undefined;
            }
            default:
                return undefined;
        }
    }
    name: string;
    description: string;
    abstract parseValue(value: any): any;
    abstract serialize(value: any): any;
    toScalar() {
        return {
            name: this.name,
            description: this.description,
            parseValue(value: any): any {
                return this.parseValue(value)
            },
            serialize(value: any): any {
                return this.serialize(value)
            },
            parseLiteral(node: any, vars: any): any {
                return this.parseLiteral(node, vars)
            }
        }
    }
}