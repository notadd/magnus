import { ast, InputObjectTypeDefinitionAst, toJson, ListTypeAst, EnumTypeDefinitionAst, EnumValueDefinitionAst, OperationDefinitionAst, ToString, ClientVisitor, DocumentAst, SelectionSetAst, SelectionAst, ObjectTypeDefinitionAst, NamedTypeAst } from '@notadd/magnus-graphql';
import { upperFirst } from 'lodash';
import { print } from 'graphql';
import { MagnusConfig } from '@notadd/magnus-core';

export class ClientTs extends ClientVisitor {
    visitVariableAst(node: ast.VariableAst, context: any): any {
        const name = node.name.visit(this, context);
        return name;
    }
    visitNonNullTypeAst(node: ast.NonNullTypeAst, context: any): any {
        return {
            required: true,
            type: node.type.visit(this, context)
        }
    }
    visitNamedTypeAst(node: ast.NamedTypeAst, context: any): string {
        return node.name && node.name.visit(this, context)
    }
}
const client = new ClientTs();
export class GraphqlToTs implements ast.Visitor {
    name: string = `GraphqlToTs`;
    isParameter: boolean;
    isProto: boolean;
    isGraphql: boolean;
    config: MagnusConfig;
    schema: DocumentAst;
    visitDocumentAst(node: ast.DocumentAst, context: string): string {
        context += `\n`;
        if (this.config) {
            context += `import { ${this.config.runner.name} } from '${this.config.runner.path}';\n`
        }
        const res = node.definitions.filter(def => !(def instanceof ast.ScalarTypeDefinitionAst) && !!def).map(def => def.visit(this, ``)).join(`\n`);
        const types: string[] = [];
        this.types.forEach(t => types.push(t));
        if (this.config) {
            if (types.length > 0) {
                context += `import { ${types.join(', ')} } from '${this.config.types}';\n`;
            }
        }
        context += res;
        return context;
    }

    visitTypeDefinitionAst(node: ast.TypeDefinitionAst, context: string): string {
        return context;
    }

    visitFieldDefinitionAst(node: ast.FieldDefinitionAst, context: boolean): string {
        this.isParameter = false;
        const name = node.name.visit(this, ``)
        const type = node.type.visit(this, ``);
        const parameters = (node.arguments || []).map(arg => {
            this.isParameter = true;
            return arg.visit(this, false)
        });
        let res = ``;
        if (node.description) {
            res += `\t/*`
            res += node.description.value || ``;
            res += `*/\n`;
        }
        if (this.isProto) {
            if (node.arguments) {
                if (parameters.length > 0) {
                    res += `\t${name}(${parameters.join(',')}): Observable<${type}>;\n`
                } else {
                    res += `\t${name}(): Observable<${type}>;\n`
                }
            } else {
                if (node.type instanceof ast.NonNullTypeAst) {
                    res += `\t${name}: Observable<${type}>;\n`
                } else {
                    res += `\t${name}?: Observable<${type}>;\n`
                }
            }
            return res;
        }
        if (this.isGraphql) {
            if (node.arguments) {
                if (parameters.length > 0) {
                    res += `\t${name}<T>(${parameters.join(', ')}, __selection?: string): Promise<T & ${type}>;\n`
                } else {
                    res += `\t${name}<T>(__selection?: string): Promise<T & ${type}>;\n`
                }
            } else {
                if (node.type instanceof ast.NonNullTypeAst) {
                    res += `\t${name}: Promise<${type}>;\n`
                } else {
                    res += `\t${name}?: Promise<${type}>;\n`
                }
            }
            return res;
        }
        if (node.arguments) {
            if (parameters.length > 0) {
                res += `\t${name}(${parameters.join(', ')}, __selection?: string): ${type};\n`
            } else {
                res += `\t${name}(__selection?: string): ${type};\n`
            }
        } else {
            if (node.type instanceof ast.NonNullTypeAst) {
                res += `\t${name}: ${type};\n`
            } else {
                res += `\t${name}?: ${type};\n`
            }
        }
        return res;
    }

    visitInputValueDefinitionAst(node: ast.InputValueDefinitionAst, context: boolean): string {
        if (node.name) {
            const name = node.name.visit(this, context);
            const type = node.type.visit(this, context);
            let res = ``
            if (node.description) {
                res += `/*`
                res += node.description.value || ``;
                res += `*/`;
            }
            if (this.isParameter) {
                if (node.type instanceof ast.NonNullTypeAst) {
                    res += `${name}: ${type}`
                } else {
                    res += `${name}?: ${type}`
                }
                return res;
            }
            if (node.type instanceof ast.NonNullTypeAst) {
                res += `\t${name}: ${type};\n`
            } else {
                res += `\t${name}?: ${type};\n`
            }
            return res;
        }
        return ``
    }

    visitNameAst(node: ast.NameAst, context: string): string {
        switch (node.value) {
            case 'Int':
            case 'Int32':
            case 'Int64':
                return `number`;
            case 'String':
                return `string`;
            case 'Boolean':
            case 'Bool':
                return 'boolean';
            case 'Json':
                return 'object';
            default:
                return node.value;
        }
    }

    visitNamedTypeAst(node: ast.NamedTypeAst, context: string): string {
        return node.name.visit(this, context);
    }

    visitScalarTypeDefinitionAst(node: ast.ScalarTypeDefinitionAst, context: string): string {
        return ``
    }

    visitObjectTypeDefinitionAst(node: ast.ObjectTypeDefinitionAst, context: string): string {
        const name = node.name.visit(this, ``);
        this.isProto = !!node.isProto || name === 'Subscription';
        this.isGraphql = name === 'Query' || name === 'Mutation';

        if (node.description) {
            context += `/*`
            context += node.description.value || ``;
            context += `*/\n`;
        }
        context += `export interface ${name} {\n`
        context += node.fields.map(field => {
            return field.visit(this, name === 'Proto')
        }).join(``);
        context += `}`;
        return context;
    }

    visitNonNullTypeAst(node: ast.NonNullTypeAst, context: string): string {
        return node.type.visit(this, ``)
    }

    visitUnionTypeDefinitionAst(node: ast.UnionTypeDefinitionAst, context: string): string {
        const name = node.name.visit(this, context);
        const types = node.types.map(t => {
            if (t.visit) {
                return t.visit(this, context);
            }
            return t;
        });
        return `type ${name} = ${types.join('|')};`
    }

    visitInputObjectTypeDefinitionAst(node: InputObjectTypeDefinitionAst, context: string) {
        this.isParameter = false;
        context += `export interface ${node.name.visit(this, ``)} {\n`
        context += node.fields.map(field => field.visit(this, true)).join(``);
        context += `}`;
        return context;
    }

    visitListTypeAst(node: ListTypeAst, context: string): string {
        return `${node.type.visit(this, context)}[]`
    }

    visitEnumTypeDefinitionAst(node: EnumTypeDefinitionAst, context: string): string {
        if (node.name) {
            return `enum ${node.name.visit(this, context)}{
                ${node.values.map(value => value.visit(this, context)).join(',\n')}
                }`
        }
        return ``
    }

    visitEnumValueDefinitionAst(node: EnumValueDefinitionAst, context: string): string {
        return `\t${node.name.visit(this, context)}`
    }
    types: Set<string> = new Set();
    visitSelectionSetAst(node: SelectionSetAst, context: { operation: string, schema: ObjectTypeDefinitionAst }): string {
        return node.selections.map(selec => selec.visit(this, context)).join(``) + `\n`
    }
    visitSelectionAst(node: SelectionAst, context: { operation: string, schema: ObjectTypeDefinitionAst }) {
        if (node instanceof ast.FieldAst) { }
        if (node instanceof ast.FragmentSpreadAst) { }
        if (node instanceof ast.InlineFragmentAst) { }
    }
    createType(type: string, fileAlias: string, selectionSet: any, isArray: boolean, context: any) {
        const ast = this.schema.hasDefinitionAst(type);
        if (ast) {
            if (ast instanceof ObjectTypeDefinitionAst) {
                return `\t${fileAlias}: {\n${selectionSet.visit(this, {
                    ...context,
                    schema: ast
                })}}${isArray ? '[]' : ''};\n`
            } else {
                debugger;
            }
        }
        switch (type) {
            case 'Int':
                return `\t${fileAlias}: number${isArray ? '[]' : ''};\n`;
            case "String":
                return `\t${fileAlias}: string${isArray ? '[]' : ''};\n`;
            case "Boolean":
                return `\t${fileAlias}: boolean${isArray ? '[]' : ''};\n`
            default:
                debugger;
        }
    }
    getType(node: ast.TypeAst): string {
        if (node instanceof NamedTypeAst) {
            return node.name.value;
        }
        else if (node instanceof ListTypeAst) {
            return this.getType(node.type)
        } else {
            return this.getType(node.type)
        }
    }
    visitFieldAst(node: ast.FieldAst, context: { operation: string, schema: ObjectTypeDefinitionAst }): any {
        const { alias, name, arguments: args, directives, selectionSet } = node;
        const fieldName = this.visitNameAst(name, ``)
        const schema = context.schema.getFields(fieldName);
        const fieldNlias = (alias || name).visit(this, context);
        if (schema) {
            const type = this.getType(schema.type)
            if (schema.type instanceof NamedTypeAst) {
                return this.createType(type, fieldNlias, selectionSet, false, context)
            } else if (schema.type instanceof ListTypeAst) {
                return this.createType(type, fieldNlias, selectionSet, true, context)
            }
            else {
                return this.createType(type, fieldNlias, selectionSet, false, context)
            }
        } else {
            console.log(`类型错误: ${context.schema.name.value}不存在${fieldName}属性`)
        }
    }
    getSchema(operation: string) {
        return this.schema.hasDefinitionAst(upperFirst(operation))
    }
    private __getType(type: string) {
        switch (type) {
            case 'Int':
                return `number`
            case "String":
                return `string`
            case "Boolean":
            case "Bool":
                return `boolean`
            default:
                this.types.add(type);
                return type;
        }
    }
    visitOperationDefinitionAst(node: OperationDefinitionAst, context: string) {
        const clientAst = client.visitOperationDefinitionAst(node, {});
        const operation = node.operation;
        const names: string[] = [];
        const parameters = clientAst.variableDefinitions.map(variable => {
            let type = ``
            if (typeof variable.type === 'object') {
                const variableType = variable.type as any;
                if (variableType.required) {
                    type = `: ${this.__getType(variableType.type)}`
                } else {
                    type = `?: ${this.__getType(variableType.type)}`
                }
            } else {
                type = `?: ${this.__getType(variable.type)}`
            }
            names.push(variable.variable)
            if (variable.defaultValue) {
                return `${variable.variable}${type} = ${variable.defaultValue}`
            } else {
                return `${variable.variable}${type}`
            }
        }).join(`, `);
        const doc = new ast.DocumentAst();
        doc.definitions.push(node);
        const graphql = print(toJson(doc));
        const selection = node.selectionSet.visit(this, { operation, schema: this.getSchema(operation) });
        context += `interface ${upperFirst(clientAst.name as string)}Result {
    ${selection}
}\n`;
        context += `export async function ${clientAst.name}(${parameters}): Promise<${upperFirst(clientAst.name as string)}Result> {
    const names = ${JSON.stringify(names)};
    const args: any = {};
    for (let i = 0; i < arguments.length; i++) {
        args[names[i]] = arguments[i]
    }
    return ${this.config.runner.name}<${upperFirst(clientAst.name as string)}Result>(\`${graphql}\`, args)
}\n`
        return context;
    }

    // visitEnumTypeDefinitionAst(node: EnumTypeDefinitionAst, context: any) { }
}

