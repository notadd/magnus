import { parse } from './parse'
import * as ast from './ast';
/**
 * 执行
 * @param server 
 * @param client 
 * @param variables 
 */
export function exec(server: string, client: string, variables: any) {
    const serverAst = parse(server);
    const clientAst = parse(client);
    const execVisitor = new ExecVisitor();
    const context = new ExecContext();
    clientAst.visit(execVisitor, context);
    debugger;
}
export class ExecContext {
    errors: any[] = [];
    result: any;
    variables: { [key: string]: any } = {};
}
export class ExecVisitor implements ast.Visitor {
    name: string = `ExecVisitor`;
    visitDocumentAst(node: ast.DocumentAst, context: ExecContext) {
        const definitions = node.definitions.map(def => def.visit(this, context));
        debugger;
    }
    createVariables(vars: Array<ast.VariableDefinitionAst>, context: ExecContext): {
        [key: string]: VariableDefinition
    } {
        const res: any = {};
        vars.map(vari => {
            const result = vari.visit(this, context);
            const { variable, defaultValue } = result;
            const { name } = variable;
            result.value = context.variables[name] || defaultValue;
            res[`${name}`] = result;
        });
        return res;
    }
    createDirectives(vars: Array<ast.DirectiveAst>, context: ExecContext): KeyValue<Directive> {
        const res: any = {};
        vars.map(v => {
            const result = this.visitDirectiveAst(v, context);
            const { name } = result;
            res[name] = result;
        });
        return res;
    }
    createInputValueDefinition(nodes: ast.InputValueDefinitionAst[], context: ExecContext) {
        const res: any = {};
        nodes.map(node => {
            const ast = node.visit(this, context);
            debugger;
        });
        return res;
    }
    visitDirectiveDefinitionAst(node: ast.DirectiveDefinitionAst, context: ExecContext): DirectiveDefinition {
        const description = node.description.visit(this, context);
        const name = node.name.visit(this, context)
        const args = this.createInputValueDefinition(node.arguments, context);
        const locations = node.locations.map(loc => loc.visit(this, context))
        return {
            description,
            name,
            args,
            locations
        }
    }
    visitOperationDefinitionAst(node: ast.OperationDefinitionAst, context: ExecContext): OperationDefinition {
        const name = node.name && node.name.visit(this, context);
        const variableDefinitions = this.createVariables(node.variableDefinitions, context);
        const directives = this.createDirectives(node.directives, context);
        const selectionSet = node.selectionSet && node.selectionSet.visit(this, context);
        return {
            name,
            variableDefinitions,
            selectionSet,
            directives,
            operation: node.operation
        }
    }
    visitSelectionSetAst(node: ast.SelectionSetAst, context: ExecContext): { [key: string]: Selection } {
        const res: any = {};
        node.selections.map(sele => {
            const result = sele.visit(this, context);
            res[result.name] = result;
        });
        return res;
    }
    createArgument(nodes: ast.ArgumentAst[], context: ExecContext) {
        const res: any = {};
        nodes.map(node => {
            const ast = node.visit(this, context);
            res[ast.name] = ast;
        });
        return res;
    }
    visitFieldAst(node: ast.FieldAst, context: ExecContext): Field {
        const alias = node.alias && node.alias.visit(this, context);
        const name = node.name && node.name.visit(this, context);
        const args = this.createArgument(node.arguments, context);
        const directives = this.createDirectives(node.directives, context);
        const selectionSet = node.selectionSet && node.selectionSet.visit(this, context);
        return {
            alias,
            name,
            args,
            directives,
            selectionSet
        }
    }
    visitNameAst(node: ast.NameAst, context: ExecContext): string {
        return node.value;
    }
    visitArgumentAst(node: ast.ArgumentAst, context: ExecContext): Argument {
        const name = node.name.visit(this, context);
        const value = node.value.visit(this, context)
        return {
            name,
            value
        }
    }
    visitVariableAst(node: ast.VariableAst, context: ExecContext): Variable {
        const name = node.name.visit(this, context)
        return {
            name,
            kind: 'Variable'
        }
    }
    visitIntValueAst(node: ast.IntValueAst, context: ExecContext): number {
        return node.value;
    }
    visitBooleanValueAst(node: ast.BooleanValueAst, context: ExecContext): boolean {
        return node.value;
    }
    visitDirectiveAst(node: ast.DirectiveAst, context: ExecContext): Directive {
        const name = node.name.visit(this, context);
        const args = this.createArgument(node.arguments, context);
        return {
            name,
            args
        }
    }
    visitVariableDefinitionAst(node: ast.VariableDefinitionAst, context: ExecContext): VariableDefinition {
        const defaultValue = node.defaultValue && node.defaultValue.visit(this, context);
        const directives = this.createDirectives(node.directives, context);
        const type = node.type && node.type.visit(this, context);
        const variable = node.variable && node.variable.visit(this, context);
        return {
            defaultValue,
            directives,
            type,
            variable,
            value: undefined
        }
    }
    visitNonNullTypeAst(node: ast.NonNullTypeAst, context: ExecContext): NonNullType {
        const type = node.type.visit(this, context);
        return {
            type,
            kind: `NonNullType`
        }
    }
    visitListTypeAst(node: ast.ListTypeAst, context: ExecContext): ListType {
        const type = node.type.visit(this, context);
        return {
            type,
            kind: `ListType`
        }
    }
    visitNamedTypeAst(node: ast.NamedTypeAst, context: ExecContext): string {
        return node.name.visit(this, context);
    }
}
export interface KeyValue<T> {
    [key: string]: T;
}
export interface OperationDefinition {
    name: string,
    variableDefinitions: KeyValue<VariableDefinition>;
    selectionSet: KeyValue<Selection>;
    directives: KeyValue<Directive>;
    operation: string;
}
export type Selection = Field;
export interface Field {
    alias: string,
    name: string,
    args: KeyValue<Argument>,
    directives: KeyValue<Directive>,
    selectionSet: KeyValue<Selection>;
}
export interface Variable {
    kind: `Variable`;
    name: string;
}
export interface VariableDefinition {
    defaultValue: any,
    directives: KeyValue<Directive>,
    type: string | NonNullType | ListType,
    variable: Variable,
    value?: any;
}
export interface Argument {
    name: string;
    value: any;
}
export interface Directive {
    name: string;
    args: KeyValue<Argument>;
}
export interface VariableDefinition {
    defaultValue: any;
}
export interface NonNullType {
    kind: `NonNullType`;
    type: string | ListType;
}
export interface ListType {
    kind: `ListType`;
    type: string | NonNullType | ListType;
}
export interface DirectiveDefinition {
    description: string,
    name: string,
    args: KeyValue<Argument>,
    locations: any;
}