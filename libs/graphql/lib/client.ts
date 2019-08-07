import * as ast from "./ast";
export interface OperationDefinitionJson {
    directives: Directives;
    name: string;
    operation: ast.OperationType,
    selections: any[];
    variableDefinitions: any[];
}

export interface Arguments {
    [key: string]: ArgumentJson
}
export interface ArgumentJson {
    name: any;
    value: any;
}
export interface DocumentJson {
    definitions: any[];
}
interface Directives {
    [key: string]: DirectiveJson;
}
export interface DirectiveJson {
    name: string;
    args: Arguments;
}
export interface SelectionSetJson {
    [key: string]: FieldJson | FragmentSpreadJson | InlineFragmentJson
}
interface FragmentSpreadJson {
    name: string;
    directives: Directives;
    type: 'FragmentSpread';
}
interface InlineFragmentJson {
    name: string,
    directives: Directives,
    selectionSet: SelectionSetJson,
    type: 'InlineFragment'
}
export interface FieldJson {
    alias: string;
    args: Arguments;
    directives: Directives;
    name: string;
    selectionSet: SelectionSetJson;
    type: `FieldJson`
}
interface VariableDefinitionJson {
    variable: any;
    type: any;
    directives: Directives;
    defaultValue: any;
}
export class ClientVisitor implements ast.Visitor {
    name: string = `ClientVisitor`;
    visitFieldAst(node: ast.FieldAst, context: any): FieldJson {
        const alias: string = node.alias && node.alias.visit(this, context);
        const args: { [key: string]: any } = {};
        node.arguments.map(arg => {
            const argument = this.visitArgumentAst(arg, context);
            args[argument.name] = argument.value;
        });
        const directives: any = {};
        node.directives.map(dir => {
            const dir2 = this.visitDirectiveAst(dir, context);
            directives[dir2.name] = dir2;
        });
        const name = node.name && node.name.visit(this, context)
        const selectionSet = node.selectionSet && node.selectionSet.visit(this, context);
        return {
            alias,
            args,
            directives,
            name,
            selectionSet,
            type: 'FieldJson'
        }
    }
    visitDocumentAst(node: ast.DocumentAst, context: any): any[] {
        const definitions = node.definitions.map(de => de.visit(this, context))
        return definitions;
    }
    visitDirectiveAst(node: ast.DirectiveAst, context: any): DirectiveJson {
        const name = this.visitNameAst(node.name, context);
        const args: Arguments = {};
        node.arguments.map(arg => {
            const argument = this.visitArgumentAst(arg, context);
            args[argument.name] = argument;
        });
        return {
            name,
            args
        }
    }
    createDirectives(nodes: ast.DirectiveAst[], context: any): Directives {
        const directives: Directives = {};
        nodes.map(dire => {
            const dir = this.visitDirectiveAst(dire, context);
            directives[dir.name] = dir;
        });
        return directives;
    }
    visitOperationDefinitionAst(node: ast.OperationDefinitionAst, context: any): OperationDefinitionJson {
        const name = node.name && node.name.visit(this, context)
        const operation = node.operation;
        const selections = node.selectionSet && node.selectionSet.visit(this, context);
        const variableDefinitions = node.variableDefinitions.map(def => def.visit(this, context))
        return {
            directives: this.createDirectives(node.directives, context),
            name,
            operation,
            selections,
            variableDefinitions
        }
    }
    visitSelectionSetAst(node: ast.SelectionSetAst, context: any): SelectionSetJson {
        const res: SelectionSetJson = {};
        node.selections.map(sel => {
            const selection = this.visitSelectionAst(sel, context);
            res[selection.name] = selection;
        });
        return res;
    }

    visitSelectionAst(node: ast.SelectionAst, context: any): FieldJson | FragmentSpreadJson | InlineFragmentJson {
        if (node instanceof ast.FieldAst) {
            return this.visitFieldAst(node, context)
        }
        else if (node instanceof ast.FragmentSpreadAst) {
            return this.visitFragmentSpreadAst(node, context)
        }
        else {
            return this.visitInlineFragmentAst(node, context)
        }
    }

    visitFragmentSpreadAst(node: ast.FragmentSpreadAst, context: any): FragmentSpreadJson {
        const name = node.name.visit(this, context);
        const directives: Directives = this.createDirectives(node.directives, context)
        return {
            name, directives, type: 'FragmentSpread'
        };
    }

    visitInlineFragmentAst(node: ast.InlineFragmentAst, context: any): InlineFragmentJson {
        const typeCondition = this.visitNamedTypeAst(node.typeCondition, context);
        const directives: Directives = this.createDirectives(node.directives, context)
        const selectionSet = this.visitSelectionSetAst(node.selectionSet, context)
        return {
            name: typeCondition,
            directives,
            selectionSet,
            type: 'InlineFragment'
        };
    }

    visitArgumentAst(node: ast.ArgumentAst, context: any): ArgumentJson {
        const name = node.name.visit(this, context);
        const value = node.value.visit(this, context);
        return {
            name,
            value
        }
    }
    visitBooleanValueAst(node: ast.BooleanValueAst, context: any) {
        return node.value;
    }
    visitStringValueAst(node: ast.StringValueAst, context: any) {
        return node.value;
    }
    visitNameAst(node: ast.NameAst, context: any): string {
        return node.value
    }
    visitIntValueAst(node: ast.IntValueAst, context: any) {
        return node.value;
    }
    visitVariableDefinitionAst(node: ast.VariableDefinitionAst, context: any): VariableDefinitionJson {
        const variable = node.variable && node.variable.visit(this, context)
        const type = node.type && node.type.visit(this, context)
        const defaultValue = node.defaultValue && node.defaultValue.visit(this, context)
        return {
            variable,
            type,
            directives: this.createDirectives(node.directives, context),
            defaultValue
        }
    }
    visitVariableAst(node: ast.VariableAst, context: any): any {
        const name = node.name.visit(this, context);
        return context[name];
    }
    visitNonNullTypeAst(node: ast.NonNullTypeAst, context: any): any {
        return node.type.visit(this, context)
    }
    visitNamedTypeAst(node: ast.NamedTypeAst, context: any): string {
        return node.name && node.name.visit(this, context)
    }
    visitObjectValueAst(node: ast.ObjectValueAst, context: any) {
        const res: any = {};
        node.fields.map(field => field.visit(this, res))
        return res;
    }
    visitObjectFieldAst(node: ast.ObjectFieldAst, context: any) {
        context[node.name.visit(this, context)] = node.value.visit(this, context)
    }
    visitListValueAst(node: ast.ListValueAst, context: any): any {
        return node.values.map(val => val.visit(this, context))
    }
}

