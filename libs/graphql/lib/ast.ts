export abstract class Ast<C = any, O = any> {
    abstract visit(visitor: Visitor, context: C): O;
    abstract copy(): any;
}
export type ASTNode<C = any, O = any> =
    | NameAst<C, O>
    | DocumentAst<C, O>
    | OperationDefinitionAst<C, O>
    | VariableDefinitionAst<C, O>
    | VariableAst<C, O>
    | SelectionSetAst<C, O>
    | FieldAst<C, O>
    | ArgumentAst<C, O>
    | FragmentSpreadAst<C, O>
    | InlineFragmentAst<C, O>
    | FragmentDefinitionAst<C, O>
    | IntValueAst<C, O>
    | FloatValueAst<C, O>
    | StringValueAst<C, O>
    | BooleanValueAst<C, O>
    | NullValueAst<C, O>
    | EnumValueAst<C, O>
    | ListValueAst<C, O>
    | ObjectValueAst<C, O>
    | ObjectFieldAst<C, O>
    | DirectiveAst<C, O>
    | NamedTypeAst<C, O>
    | ListTypeAst<C, O>
    | NonNullTypeAst<C, O>
    | SchemaDefinitionAst<C, O>
    | OperationTypeDefinitionAst<C, O>
    | ScalarTypeDefinitionAst<C, O>
    | ObjectTypeDefinitionAst<C, O>
    | FieldDefinitionAst<C, O>
    | InputValueDefinitionAst<C, O>
    | InterfaceTypeDefinitionAst<C, O>
    | UnionTypeDefinitionAst<C, O>
    | EnumTypeDefinitionAst<C, O>
    | EnumValueDefinitionAst<C, O>
    | InputObjectTypeDefinitionAst<C, O>
    | DirectiveDefinitionAst<C, O>
    | SchemaExtensionAst<C, O>
    | ScalarTypeExtensionAst<C, O>
    | ObjectTypeExtensionAst<C, O>
    | InterfaceTypeExtensionAst<C, O>
    | UnionTypeExtensionAst<C, O>
    | EnumTypeExtensionAst<C, O>
    | InputObjectTypeExtensionAst<C, O>;

/**
 * scalar
 * type
 * interface
 * union
 * enum
 * input
 */
export type TypeDefinitionAst<C = any, O = any> =
    ScalarTypeDefinitionAst<C, O> |
    ObjectTypeDefinitionAst<C, O> |
    InterfaceTypeDefinitionAst<C, O> |
    UnionTypeDefinitionAst<C, O> |
    EnumTypeDefinitionAst<C, O> |
    InputObjectTypeDefinitionAst<C, O>;

export type DefinitionAst<C = any, O = any> =
    ExecutableDefinitionAst<C, O> |
    TypeSystemDefinitionAst<C, O> |
    TypeSystemExtensionAst<C, O>;
export type TypeSystemDefinitionAst<C = any, O = any> =
    SchemaDefinitionAst<C, O> |
    TypeDefinitionAst<C, O> |
    DirectiveDefinitionAst<C, O>;
export type ExecutableDefinitionAst<C = any, O = any> =
    OperationDefinitionAst<C, O> |
    FragmentDefinitionAst<C, O>;
export type TypeSystemExtensionAst<C = any, O = any> =
    SchemaExtensionAst<C, O> |
    TypeExtensionAst<C, O>;
export type TypeExtensionAst<C = any, O = any> =
    ScalarTypeExtensionAst |
    ObjectTypeExtensionAst |
    InterfaceTypeExtensionAst |
    UnionTypeExtensionAst |
    EnumTypeExtensionAst |
    InputObjectTypeExtensionAst;

export class SchemaExtensionAst<C = any, O = any> extends Ast<C, O> {
    directives: ReadonlyArray<DirectiveAst> = [];
    operationTypes: ReadonlyArray<OperationTypeDefinitionAst>;
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitSchemaExtensionAst) {
            return visitor.visitSchemaExtensionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitSchemaExtensionAst`)
        }
    }
    copy() {
        const ast = new SchemaExtensionAst()
        ast.directives = this.directives && this.directives.map(d => d.copy())
        ast.operationTypes = this.operationTypes.map(o => o.copy())
        return ast;
    }
}

export type ValueAst<C = any, O = any> =
    | VariableAst<C, O>
    | IntValueAst<C, O>
    | FloatValueAst<C, O>
    | StringValueAst<C, O>
    | BooleanValueAst<C, O>
    | NullValueAst<C, O>
    | EnumValueAst<C, O>
    | ListValueAst<C, O>
    | ObjectValueAst<C, O>;


export type TypeAst<C = any, O = any> = NamedTypeAst<C, O> | ListTypeAst<C, O> | NonNullTypeAst<C, O>;
export type OperationType = 'query' | 'mutation' | 'subscription';
export type SelectionAst<C = any, O = any> = FieldAst<C, O> | FragmentSpreadAst<C, O> | InlineFragmentAst<C, O>;

export interface Visitor<C = any, O = any> {
    name: string;
    visit?(node: Ast, context: C): O;
    visitTypeDefinitionAst?(node: TypeDefinitionAst<C, O>, context: C): O;
    visitDefinitionAst?(node: DefinitionAst<C, O>, context: C): O;
    visitTypeSystemDefinitionAst?(node: TypeSystemDefinitionAst<C, O>, context: C): O;
    visitExecutableDefinitionAst?(node: ExecutableDefinitionAst<C, O>, context: C): O;
    visitSchemaExtensionAst?(node: SchemaExtensionAst<C, O>, context: C): O;
    visitTypeExtensionAst?(node: TypeExtensionAst<C, O>, context: C): O;
    visitTypeSystemExtensionAst?(node: TypeSystemExtensionAst<C, O>, context: C): O;
    visitDocumentAst?(node: DocumentAst<C, O>, context: C): O;
    visitVariableAst?(node: VariableAst<C, O>, context: C): O;
    visitIntValueAst?(node: IntValueAst<C, O>, context: C): O;
    visitFloatValueAst?(node: FloatValueAst<C, O>, context: C): O;
    visitStringValueAst?(node: StringValueAst<C, O>, context: C): O;
    visitBooleanValueAst?(node: BooleanValueAst<C, O>, context: C): O;
    visitNullValueAst?(node: NullValueAst<C, O>, context: C): O;
    visitEnumValueAst?(node: EnumValueAst<C, O>, context: C): O;
    visitListValueAst?(node: ListValueAst<C, O>, context: C): O;
    visitObjectValueAst?(node: ObjectValueAst<C, O>, context: C): O;
    visitObjectFieldAst?(node: ObjectFieldAst<C, O>, context: C): O;
    visitUnionTypeExtensionAst?(node: UnionTypeExtensionAst<C, O>, context: C): O;
    visitScalarTypeExtensionAst?(node: ScalarTypeExtensionAst<C, O>, context: C): O;
    visitObjectTypeExtensionAst?(node: ObjectTypeExtensionAst<C, O>, context: C): O;
    visitNamedTypeAst?(node: NamedTypeAst<C, O>, context: C): O;
    visitInterfaceTypeExtensionAst?(node: InterfaceTypeExtensionAst<C, O>, context: C): O;
    visitFieldDefinitionAst?(node: FieldDefinitionAst<C, O>, context: C): O;
    visitInputValueDefinitionAst?(node: InputValueDefinitionAst<C, O>, context: C): O;
    visitEnumTypeExtensionAst?(node: EnumTypeExtensionAst<C, O>, context: C): O;
    visitEnumValueDefinitionAst?(node: EnumValueDefinitionAst<C, O>, context: C): O;
    visitInputObjectTypeExtensionAst?(node: InputObjectTypeExtensionAst<C, O>, context: C): O;
    visitOperationDefinitionAst?(node: OperationDefinitionAst<C, O>, context: C): O;
    visitFieldAst?(node: FieldAst<C, O>, context: C): any;
    visitFragmentSpreadAst?(node: FragmentSpreadAst<C, O>, context: C): O;
    visitInlineFragmentAst?(node: InlineFragmentAst<C, O>, context: C): O;
    visitVariableDefinitionAst?(node: VariableDefinitionAst<C, O>, context: C): O;
    visitSelectionSetAst?(node: SelectionSetAst<C, O>, context: C): O;
    visitFragmentDefinitionAst?(node: FragmentDefinitionAst<C, O>, context: C): O;
    visitSchemaDefinitionAst?(node: SchemaDefinitionAst<C, O>, context: C): O;
    visitOperationTypeDefinitionAst?(node: OperationTypeDefinitionAst<C, O>, context: C): O;
    visitDirectiveDefinitionAst?(node: DirectiveDefinitionAst<C, O>, context: C): O;
    visitScalarTypeDefinitionAst?(node: ScalarTypeDefinitionAst<C, O>, context: C): O;
    visitObjectTypeDefinitionAst?(node: ObjectTypeDefinitionAst<C, O>, context: C): O;
    visitInterfaceTypeDefinitionAst?(node: InterfaceTypeDefinitionAst<C, O>, context: C): O;
    visitUnionTypeDefinitionAst?(node: UnionTypeDefinitionAst<C, O>, context: C): O;
    visitEnumTypeDefinitionAst?(node: EnumTypeDefinitionAst<C, O>, context: C): O;
    visitInputObjectTypeDefinitionAst?(node: InputObjectTypeDefinitionAst<C, O>, context: C): O;
    visitNameAst?(node: NameAst<C, O>, context: C): O;
    visitListTypeAst?(node: ListTypeAst<C, O>, context: C): O;
    visitNonNullTypeAst?(node: NonNullTypeAst<C, O>, context: C): O;
    visitArgumentAst?(node: ArgumentAst<C, O>, context: C): O;
    visitDirectiveAst?(node: DirectiveAst<C, O>, context: C): O;
}

export class DocumentAst<C = any, O = any> extends Ast<C, O> {
    definitions: Array<DefinitionAst<C, O>> = [];
    protos: ObjectTypeDefinitionAst[] = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitDocumentAst) {
            return visitor.visitDocumentAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitDocumentAst`)
        }
    }
    getDefinitionAstIndex(name: string): number {
        return this.definitions.findIndex(def => {
            if (def instanceof OperationDefinitionAst) {
                return def.name.value === name
            } else if (def instanceof FragmentDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof SchemaDefinitionAst) {
                return false;
            } else if (def instanceof ScalarTypeDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof ObjectTypeDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof InterfaceTypeDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof UnionTypeDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof EnumTypeDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof InputObjectTypeDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof DirectiveDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof SchemaExtensionAst) {
                return false;
            } else {
                if (def && def.name) {
                    console.log(`hasDefinitionAst`, def.name.value)
                }
                return false;
                // return def.name.value === name;
            }
        })
    }
    hasDefinitionAst(name: string) {
        return this.definitions.find((def) => {
            if (def instanceof OperationDefinitionAst) {
                return def.name.value === name
            } else if (def instanceof FragmentDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof SchemaDefinitionAst) {
                return false;
            } else if (def instanceof ScalarTypeDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof ObjectTypeDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof InterfaceTypeDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof UnionTypeDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof EnumTypeDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof InputObjectTypeDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof DirectiveDefinitionAst) {
                return def.name.value === name;
            } else if (def instanceof SchemaExtensionAst) {
                return false;
            } else {
                if (def && def.name) {
                    console.log(`hasDefinitionAst`, def.name.value)
                }
                return false;
            }
        })
    }

    copy() {
        const ast = new DocumentAst();
        return ast;
    }
}

export class VariableAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitVariableAst) {
            return visitor.visitVariableAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitVariableAst`)
        }
    }
    copy() {
        const ast = new VariableAst()
        ast.name = this.name.copy();
        return ast;
    }
}

export class IntValueAst<C = any, O = any> extends Ast<C, O> {
    value: number;
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitIntValueAst) {
            return visitor.visitIntValueAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitIntValueAst`)
        }
    }
    copy() {
        const ast = new IntValueAst()
        ast.value = this.value;
        return ast;
    }
}

export class FloatValueAst<C = any, O = any> extends Ast<C, O> {
    value: number;
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitFloatValueAst) {
            return visitor.visitFloatValueAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitFloatValueAst`)
        }
    }
    copy() {
        const ast = new FloatValueAst()
        ast.value = this.value;
        return ast;
    }
}

export class StringValueAst<C = any, O = any> extends Ast<C, O> {
    value: string;
    block: boolean;
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitStringValueAst) {
            return visitor.visitStringValueAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitStringValueAst`)
        }
    }
    copy() {
        const ast = new StringValueAst();
        ast.value = this.value;
        ast.block = this.block;
        return ast;
    }
}

export class BooleanValueAst<C = any, O = any> extends Ast<C, O> {
    value: boolean;
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitBooleanValueAst) {
            return visitor.visitBooleanValueAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitBooleanValueAst`)
        }
    }
    copy() {
        const ast = new BooleanValueAst()
        ast.value = this.value;
        return ast;
    }
}

export class NullValueAst<C = any, O = any> extends Ast<C, O> {
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitNullValueAst) {
            return visitor.visitNullValueAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitNullValueAst`)
        }
    }
    copy() {
        const ast = new NullValueAst()
        return ast;
    }
}

export class EnumValueAst<C = any, O = any> extends Ast<C, O> {
    value: string;
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitEnumValueAst) {
            return visitor.visitEnumValueAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitEnumValueAst`)
        }
    }
    copy() {
        const ast = new EnumValueAst()
        ast.value = this.value;
        return ast;
    }
}
// [0,1,2]
export class ListValueAst<C = any, O = any> extends Ast<C, O> {
    values: Array<ValueAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitListValueAst) {
            return visitor.visitListValueAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitListValueAst`)
        }
    }
    copy() {
        const ast = new ListValueAst()
        ast.values = this.values.map(va => va.copy());
        return ast;
    }
}
export class ObjectValueAst<C = any, O = any> extends Ast<C, O> {
    fields: Array<ObjectFieldAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitObjectValueAst) {
            return visitor.visitObjectValueAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitObjectValueAst`)
        }
    }
    copy() {
        const ast = new ObjectValueAst()
        ast.fields = this.fields.map(field => field.copy());
        return ast;
    }
}
export class ObjectFieldAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    value: ValueAst<C, O>;
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitObjectFieldAst) {
            return visitor.visitObjectFieldAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitObjectFieldAst`)
        }
    }
    copy() {
        const ast = new ObjectFieldAst()
        ast.name = this.name.copy();
        ast.value = this.value.copy();
        return ast;
    }
}

export class UnionTypeExtensionAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    types: Array<NamedTypeAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitUnionTypeExtensionAst) {
            return visitor.visitUnionTypeExtensionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitUnionTypeExtensionAst`)
        }
    }
    copy() {
        const ast = new UnionTypeExtensionAst()
        ast.directives = this.directives && this.directives.map(d => d.copy());
        ast.types = this.types.map(t => t.copy());
        return ast;
    }
}

export class DirectiveAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    arguments: Array<ArgumentAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitDirectiveAst) {
            return visitor.visitDirectiveAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitDirectiveAst`)
        }
    }
    copy() {
        const ast = new DirectiveAst();
        ast.name = this.name.copy();
        ast.arguments = this.arguments.map(arg => arg.copy())
        return ast;
    }
}


export class ArgumentAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    value: ValueAst<C, O>;
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitArgumentAst) {
            return visitor.visitArgumentAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitArgumentAst`)
        }
    }
    copy() {
        const ast = new ArgumentAst();
        ast.name = this.name.copy();
        this.value = this.value.copy();
        return ast;
    }
}

export class ScalarTypeExtensionAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitScalarTypeExtensionAst) {
            return visitor.visitScalarTypeExtensionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitScalarTypeExtensionAst`)
        }
    }
    copy() {
        const ast = new ScalarTypeExtensionAst()
        ast.name = this.name.copy();
        ast.directives = this.directives && this.directives.map(int => int.copy())
        return ast;
    }
}

export class ObjectTypeExtensionAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    interfaces: Array<NamedTypeAst<C, O>> = [];
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitObjectTypeExtensionAst) {
            return visitor.visitObjectTypeExtensionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitObjectTypeExtensionAst`)
        }
    }
    copy() {
        const ast = new ObjectTypeExtensionAst()
        ast.name = this.name.copy();
        ast.interfaces = this.interfaces.map(int => int.copy())
        return ast;
    }
}

export class NamedTypeAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitNamedTypeAst) {
            return visitor.visitNamedTypeAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitNamedTypeAst`)
        }
    }
    copy() {
        const ast = new NamedTypeAst()
        ast.name = this.name.copy();
        return ast;
    }
}

export class InterfaceTypeExtensionAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    fields: Array<FieldDefinitionAst<C, O>> = [];
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitInterfaceTypeExtensionAst) {
            return visitor.visitInterfaceTypeExtensionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitInterfaceTypeExtensionAst`)
        }
    }
    copy() {
        const ast = new InterfaceTypeExtensionAst();
        ast.name = this.name.copy();
        ast.directives = this.directives && this.directives.map(d => d.copy());
        ast.fields = this.fields.map(f => f.copy());
        return ast;
    }
}

export class FieldDefinitionAst<C = any, O = any> extends Ast<C, O> {
    description: StringValueAst<C, O>;
    name: NameAst<C, O>;
    arguments: Array<InputValueDefinitionAst<C, O>>;
    allArguments: Array<InputValueDefinitionAst<C, O>>;
    type: TypeAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    index: number;
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitFieldDefinitionAst) {
            return visitor.visitFieldDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitFieldDefinitionAst`)
        }
    }
    copy() {
        const ast = new FieldDefinitionAst();
        ast.directives = this.directives && this.directives.map(dir => dir.copy())
        ast.index = this.index;
        ast.name = this.name && this.name.copy();
        ast.arguments = this.arguments && this.arguments.map(arg => arg.copy());
        ast.type = this.type && this.type.copy();
        ast.description = this.description && this.description.copy();
        return ast;
    }
}

export class InputValueDefinitionAst<C = any, O = any> extends Ast<C, O> {
    description: StringValueAst<C, O>;
    name: NameAst<C, O>;
    type: TypeAst<C, O>;
    defaultValue: ValueAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    index: number;
    decorator: string;
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitInputValueDefinitionAst) {
            return visitor.visitInputValueDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitInputValueDefinitionAst`)
        }
    }
    copy() {
        const ast = new InputValueDefinitionAst();
        ast.index = this.index;
        ast.directives = this.directives && this.directives.map(d => d.copy())
        ast.defaultValue = this.defaultValue && this.defaultValue.copy();
        ast.type = this.type && this.type.copy();
        ast.name = this.name && this.name.copy()
        ast.description = this.description && this.description.copy();
        return ast;
    }
}

export class EnumTypeExtensionAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    values: Array<EnumValueDefinitionAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitEnumTypeExtensionAst) {
            return visitor.visitEnumTypeExtensionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitEnumTypeExtensionAst`)
        }
    }
    copy() {
        const ast = new EnumTypeExtensionAst()
        ast.values = this.values && this.values.map(v => v.copy());
        ast.directives = this.directives && this.directives.map(d => d.copy());
        ast.name = this.name && this.name.copy();
        return ast;
    }
}
export class EnumValueDefinitionAst<C = any, O = any> extends Ast<C, O> {
    description: StringValueAst<C, O>;
    name: NameAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitEnumValueDefinitionAst) {
            return visitor.visitEnumValueDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitEnumValueDefinitionAst`)
        }
    }
    copy() {
        const ast = new EnumValueDefinitionAst()
        ast.description = this.description.copy();
        this.name = this.name.copy();
        this.directives = this.directives && this.directives.map(d => d.copy())
        return ast;
    }
}

export class InputObjectTypeExtensionAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    fields: Array<InputValueDefinitionAst<C, O>> = [];
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitInputObjectTypeExtensionAst) {
            return visitor.visitInputObjectTypeExtensionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitInputObjectTypeExtensionAst`)
        }
    }
    copy() {
        const ast = new InputObjectTypeExtensionAst()
        ast.name = this.name.copy();
        ast.directives = this.directives && this.directives.map(d => d.copy())
        ast.fields = this.fields && this.fields.map(f => f.copy())
        return ast;
    }
}

export class OperationDefinitionAst<C = any, O = any> extends Ast<C, O> {
    operation: OperationType;
    name: NameAst<C, O>;
    variableDefinitions: Array<VariableDefinitionAst<C, O>> = [];
    directives: Array<DirectiveAst<C, O>> = [];
    selectionSet: SelectionSetAst<C, O>;
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitOperationDefinitionAst) {
            return visitor.visitOperationDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitOperationDefinitionAst`)
        }
    }
    copy() {
        const ast = new OperationDefinitionAst()
        ast.directives = this.directives && this.directives.map(d => d.copy())
        ast.operation = this.operation;
        ast.name = this.name && this.name.copy();
        return ast;
    }
}

export class FieldAst<C = any, O = any> extends Ast<C, O> {
    alias: NameAst<C, O>;
    name: NameAst<C, O>;
    arguments: Array<ArgumentAst<C, O>> = [];
    directives: Array<DirectiveAst<C, O>> = [];
    selectionSet: SelectionSetAst<C, O>;
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitFieldAst) {
            return visitor.visitFieldAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitFieldAst`)
        }
    }
    copy() {
        const ast = new FieldAst()
        ast.name = this.name.copy();
        ast.alias = this.alias.copy();
        ast.arguments = this.arguments.map(arg => arg.copy());
        ast.directives = this.directives && this.directives.map(d => d.copy());
        ast.selectionSet = this.selectionSet.copy();
        return ast;
    }
}

export class FragmentSpreadAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitFragmentSpreadAst) {
            return visitor.visitFragmentSpreadAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitFragmentSpreadAst`)
        }
    }
    copy() {
        const ast = new FragmentSpreadAst();
        ast.name = this.name.copy();
        ast.directives = this.directives && this.directives.map(d => d.copy());
        return ast;
    }
}

export class InlineFragmentAst<C = any, O = any> extends Ast<C, O> {
    typeCondition: NamedTypeAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    selectionSet: SelectionSetAst<C, O>;
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitInlineFragmentAst) {
            return visitor.visitInlineFragmentAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitInlineFragmentAst`)
        }
    }
    copy() {
        const ast = new InlineFragmentAst();
        ast.typeCondition = this.typeCondition.copy();
        ast.directives = this.directives && this.directives.map(d => d.copy());
        ast.selectionSet = this.selectionSet.copy();
        return ast;
    }
}

export class VariableDefinitionAst<C = any, O = any> extends Ast<C, O> {
    variable: VariableAst<C, O>;
    type: TypeAst<C, O>;
    defaultValue: ValueAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitVariableDefinitionAst) {
            return visitor.visitVariableDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitVariableDefinitionAst`)
        }
    }
    copy() {
        const ast = new VariableDefinitionAst();
        ast.variable = this.variable.copy();
        ast.type = this.type.copy();
        ast.defaultValue = this.defaultValue.copy();
        ast.directives = this.directives && this.directives.map(d => d.copy());
        return ast;
    }
}
export class SelectionSetAst<C = any, O = any> extends Ast<C, O> {
    selections: Array<SelectionAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitSelectionSetAst) {
            return visitor.visitSelectionSetAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitSelectionSetAst`)
        }
    }
    copy() {
        const ast = new SelectionSetAst();
        ast.selections = this.selections.map(sel => sel.copy())
        return ast;
    }
}
export class FragmentDefinitionAst<C = any, O = any> extends Ast<C, O> {
    name: NameAst<C, O>;
    variableDefinitions: Array<VariableDefinitionAst<C, O>> = [];
    typeCondition: NamedTypeAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    selectionSet: SelectionSetAst<C, O>;
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitFragmentDefinitionAst) {
            return visitor.visitFragmentDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitFragmentDefinitionAst`)
        }
    }
    copy() {
        const ast = new FragmentDefinitionAst();
        ast.name = this.name;
        ast.variableDefinitions = this.variableDefinitions.map(v => v.copy());
        ast.typeCondition = this.typeCondition.copy();
        ast.directives = this.directives && this.directives.map(d => d.copy());
        ast.selectionSet = this.selectionSet.copy();
        return ast;
    }
}

export class SchemaDefinitionAst<C = any, O = any> extends Ast<C, O> {
    directives: Array<DirectiveAst<C, O>> = [];
    operationTypes: Array<OperationTypeDefinitionAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitSchemaDefinitionAst) {
            return visitor.visitSchemaDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitSchemaDefinitionAst`)
        }
    }
    copy() {
        const ast = new SchemaDefinitionAst()
        ast.directives = this.directives && this.directives.map(d => d.copy());
        ast.operationTypes = this.operationTypes.map(t => t.copy())
        return ast;
    }
}

export class OperationTypeDefinitionAst<C = any, O = any> extends Ast<C, O> {
    operation: OperationType;
    type: NamedTypeAst<C, O>;
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitOperationTypeDefinitionAst) {
            return visitor.visitOperationTypeDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitOperationTypeDefinitionAst`)
        }
    }
    copy() {
        const ast = new OperationTypeDefinitionAst()
        ast.operation = this.operation;
        ast.type = this.type.copy();
        return ast;
    }
}
export class DirectiveDefinitionAst<C = any, O = any> extends Ast<C, O> {
    description: StringValueAst<C, O>;
    name: NameAst<C, O>;
    arguments: Array<InputValueDefinitionAst<C, O>> = [];
    locations: Array<NameAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitDirectiveDefinitionAst) {
            return visitor.visitDirectiveDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitDirectiveDefinitionAst`)
        }
    }
    copy() {
        const ast = new DirectiveDefinitionAst();
        ast.description = this.description.copy();
        ast.name = this.name.copy();
        ast.arguments = this.arguments.map(a => a.copy());
        ast.locations = this.locations.map(l => l.copy())
        return ast;
    }
}
export class ScalarTypeDefinitionAst<C = any, O = any> extends Ast<C, O> {
    description: StringValueAst<C, O>;
    name: NameAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitScalarTypeDefinitionAst) {
            return visitor.visitScalarTypeDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitScalarTypeDefinitionAst`)
        }
    }
    copy() {
        const ast = new ScalarTypeDefinitionAst();
        ast.description = this.description.copy();
        ast.name = this.name.copy();
        ast.directives = this.directives && this.directives.map(d => d.copy())
        return ast;
    }
}
export class ObjectTypeDefinitionAst<C = any, O = any> extends Ast<C, O> {
    description: StringValueAst<C, O>;
    name: NameAst<C, O>;
    interfaces: Array<NamedTypeAst<C, O>> = [];
    directives: Array<DirectiveAst<C, O>> = [];
    fields: Array<FieldDefinitionAst<C, O>> = [];
    isGrpc: boolean;
    isProto: boolean;
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitObjectTypeDefinitionAst) {
            return visitor.visitObjectTypeDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitObjectTypeDefinitionAst`)
        }
    }

    getFields(name: string): FieldDefinitionAst | undefined {
        return this.fields.find(field => field.name.value === name)
    }

    copy() {
        const ast = new ObjectTypeDefinitionAst();
        ast.description = this.description.copy();
        ast.name = this.name.copy();
        ast.interfaces = this.interfaces.map(i => i.copy());
        ast.directives = this.directives && this.directives.map(d => d.copy());
        ast.fields = this.fields.map(d => d.copy());
        ast.isGrpc = this.isGrpc;
        ast.isProto = this.isProto;
        ast.description = this.description.copy();
        return ast;
    }
}
export class InterfaceTypeDefinitionAst<C = any, O = any> extends Ast<C, O> {
    description: StringValueAst<C, O>;
    name: NameAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    fields: Array<FieldDefinitionAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitInterfaceTypeDefinitionAst) {
            return visitor.visitInterfaceTypeDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitInterfaceTypeDefinitionAst`)
        }
    }
    copy() {
        const ast = new InterfaceTypeDefinitionAst()
        ast.description = this.description.copy();
        ast.name = this.name.copy();
        ast.directives = this.directives && this.directives.map(d => d.copy())
        ast.fields = this.fields.map(f => f.copy());
        return ast;
    }
}

export class UnionTypeDefinitionAst<C = any, O = any> extends Ast<C, O> {
    description: StringValueAst<C, O>;
    name: NameAst<C, O>;
    directives: ReadonlyArray<DirectiveAst<C, O>> = [];
    types: ReadonlyArray<NamedTypeAst<C, O>>;
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitUnionTypeDefinitionAst) {
            return visitor.visitUnionTypeDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitUnionTypeDefinitionAst`)
        }
    }
    copy() {
        const ast = new UnionTypeDefinitionAst()
        ast.description = this.description.copy();
        ast.name = this.name.copy();
        ast.directives = this.directives && this.directives.map(d => d.copy())
        ast.types = this.types.map(d => d.copy())
        return ast;
    }
}

export class EnumTypeDefinitionAst<C = any, O = any> extends Ast<C, O> {
    description: StringValueAst<C, O>;
    name: NameAst<C, O>;
    directives: ReadonlyArray<DirectiveAst<C, O>> = [];
    values: ReadonlyArray<EnumValueDefinitionAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitEnumTypeDefinitionAst) {
            return visitor.visitEnumTypeDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitEnumTypeDefinitionAst`)
        }
    }
    copy() {
        const ast = new EnumTypeDefinitionAst()
        ast.description = this.description.copy();
        ast.name = this.name.copy();
        ast.directives = this.directives && this.directives.map(d => d.copy());
        ast.values = this.values.map(v => v.copy())
        return ast;
    }
}

export class InputObjectTypeDefinitionAst<C = any, O = any> extends Ast<C, O> {
    description: StringValueAst<C, O>;
    name: NameAst<C, O>;
    directives: Array<DirectiveAst<C, O>> = [];
    fields: Array<InputValueDefinitionAst<C, O>> = [];
    visit(visitor: Visitor, context: C): O {
        if (visitor.visitInputObjectTypeDefinitionAst) {
            return visitor.visitInputObjectTypeDefinitionAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitInputObjectTypeDefinitionAst`)
        }
    }
    copy() {
        const ast = new InputObjectTypeDefinitionAst()
        ast.description = this.description && this.description.copy();
        ast.name = this.name && this.name.copy();
        ast.directives = this.directives && this.directives.map(d => d.copy());
        ast.fields = this.fields && this.fields.map(f => f.copy())
        return ast;
    }
}


export class NameAst<C = any, O = any> extends Ast<C, O> {
    value: string;
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitNameAst) {
            return visitor.visitNameAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitNameAst`)
        }
    }
    copy() {
        const ast = new NameAst();
        ast.value = this.value;
        return ast;
    }
}

export class ListTypeAst<C = any, O = any> extends Ast<C, O> {
    type: TypeAst<C, O>;
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitListTypeAst) {
            return visitor.visitListTypeAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitListTypeAst`)
        }
    }
    copy() {
        const ast = new ListTypeAst()
        ast.type = this.type.copy();
        return ast;
    }
}

export class NonNullTypeAst<C = any, O = any> extends Ast<C, O> {
    type: NamedTypeAst<C, O> | ListTypeAst<C, O>;
    visit(visitor: Visitor<C, O>, context: C): O {
        if (visitor.visitNonNullTypeAst) {
            return visitor.visitNonNullTypeAst(this, context)
        } else {
            throw new Error(`${visitor.name} requied visitNonNullTypeAst`)
        }
    }
    copy() {
        const ast = new NonNullTypeAst()
        ast.type = this.type.copy();
        return ast;
    }
}
