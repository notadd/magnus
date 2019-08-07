
import { OperationType } from './ast'
export type ASTJson =
    | NameJson
    | DocumentJson
    | OperationDefinitionJson
    | VariableDefinitionJson
    | VariableJson
    | SelectionSetJson
    | FieldJson
    | ArgumentJson
    | FragmentSpreadJson
    | InlineFragmentJson
    | FragmentDefinitionJson
    | IntValueJson
    | FloatValueJson
    | StringValueJson
    | BooleanValueJson
    | NullValueJson
    | EnumValueJson
    | ListValueJson
    | ObjectValueJson
    | ObjectFieldJson
    | DirectiveJson
    | NamedTypeJson
    | ListTypeJson
    | NonNullTypeJson
    | SchemaDefinitionJson
    | OperationTypeDefinitionJson
    | ScalarTypeDefinitionJson
    | ObjectTypeDefinitionJson
    | FieldDefinitionJson
    | InputValueDefinitionJson
    | InterfaceTypeDefinitionJson
    | UnionTypeDefinitionJson
    | EnumTypeDefinitionJson
    | EnumValueDefinitionJson
    | InputObjectTypeDefinitionJson
    | DirectiveDefinitionJson
    | SchemaExtensionJson
    | ScalarTypeExtensionJson
    | ObjectTypeExtensionJson
    | InterfaceTypeExtensionJson
    | UnionTypeExtensionJson
    | EnumTypeExtensionJson
    | InputObjectTypeExtensionJson;

/**
 * scalar
 * type
 * interface
 * union
 * enum
 * input
 */
export type TypeDefinitionJson =
    ScalarTypeDefinitionJson |
    ObjectTypeDefinitionJson |
    InterfaceTypeDefinitionJson |
    UnionTypeDefinitionJson |
    EnumTypeDefinitionJson |
    InputObjectTypeDefinitionJson;

export type DefinitionJson =
    ExecutableDefinitionJson |
    TypeSystemDefinitionJson |
    TypeSystemExtensionJson;

export type TypeSystemDefinitionJson =
    SchemaDefinitionJson |
    TypeDefinitionJson |
    DirectiveDefinitionJson;

export type ExecutableDefinitionJson =
    OperationDefinitionJson |
    FragmentDefinitionJson;

export type TypeSystemExtensionJson =
    SchemaExtensionJson |
    TypeExtensionJson;

export type TypeExtensionJson =
    ScalarTypeExtensionJson |
    ObjectTypeExtensionJson |
    InterfaceTypeExtensionJson |
    UnionTypeExtensionJson |
    EnumTypeExtensionJson |
    InputObjectTypeExtensionJson;

export interface SchemaExtensionNode {
    directives: Array<DirectiveJson>;
    operationTypes: Array<OperationTypeDefinitionJson>;
}

export type ValueJson =
    | VariableJson
    | IntValueJson
    | FloatValueJson
    | StringValueJson
    | BooleanValueJson
    | NullValueJson
    | EnumValueJson
    | ListValueJson
    | ObjectValueJson;

export type TypeJson = NamedTypeJson | ListTypeJson | NonNullTypeJson;
export type SelectionJson = FieldJson | FragmentSpreadJson | InlineFragmentJson;

export interface DocumentJson {
    kind: 'Document'
    definitions: Array<DefinitionJson>;
}

export interface VariableJson {
    kind: 'Variable'
    name: NameJson;
}

export interface IntValueJson {
    kind: 'IntValue'
    value: number;
}

export interface FloatValueJson {
    kind: 'FloatValue'
    value: number;
}

export interface StringValueJson {
    kind: 'StringValue'
    value: string;
    block: boolean;
}

export interface BooleanValueJson {
    kind: 'BooleanValue';
    value: boolean;
}

export interface NullValueJson {
    kind: 'NullValue';
}

export interface EnumValueJson {
    kind: 'EnumValue';
    value: string;
}
// [0,1,2]
export interface ListValueJson {
    kind: 'ListValue';
    values: Array<ValueJson>;
}
export interface ObjectValueJson {
    kind: 'ObjectValue';
    fields: Array<ObjectFieldJson>;
}
export interface ObjectFieldJson {
    kind: 'ObjectField';
    name: NameJson;
    value: ValueJson;
}

export interface UnionTypeExtensionJson {
    kind: 'UnionTypeExtension';
    name: NameJson;
    directives: Array<DirectiveJson>;
    types: Array<NamedTypeJson>;
}

export interface DirectiveJson {
    kind: 'Directive';
    name: NameJson;
    arguments: Array<ArgumentJson>;
}


export interface ArgumentJson {
    kind: 'Argument';
    name: NameJson;
    value: ValueJson;
}

export interface ScalarTypeExtensionJson {
    kind: 'ScalarTypeExtension'
    name: NameJson;
    directives: Array<DirectiveJson>;
}

export interface ObjectTypeExtensionJson {
    kind: 'ObjectTypeExtension'
    name: NameJson;
    interfaces: Array<NamedTypeJson>;
}

export interface NamedTypeJson {
    kind: 'NamedType'
    name: NameJson;
}

export interface InterfaceTypeExtensionJson {
    kind: 'InterfaceTypeExtension'
    name: NameJson;
    directives: Array<DirectiveJson>;
    fields: Array<FieldDefinitionJson>;
}

export interface FieldDefinitionJson {
    kind: 'FieldDefinition'
    description: StringValueJson;
    name: NameJson;
    arguments: Array<InputValueDefinitionJson>;
    type: TypeJson;
    directives: Array<DirectiveJson>;
}

export interface InputValueDefinitionJson {
    kind: 'InputValueDefinition',
    description: StringValueJson;
    name: NameJson;
    type: TypeJson;
    defaultValue: ValueJson;
    directives: Array<DirectiveJson>;
}

export interface EnumTypeExtensionJson {
    kind: 'EnumTypeExtension',
    name: NameJson;
    directives: Array<DirectiveJson>;
    values: Array<EnumValueDefinitionJson>;
}
export interface EnumValueDefinitionJson {
    kind: 'EnumValueDefinition',
    description: StringValueJson;
    name: NameJson;
    directives: Array<DirectiveJson>;
}

export interface InputObjectTypeExtensionJson {
    kind: 'InputObjectTypeExtension',
    name: NameJson;
    directives: Array<DirectiveJson>;
    fields: Array<InputValueDefinitionJson>;
}

export interface OperationDefinitionJson {
    kind: 'OperationDefinition',
    operation: OperationType;
    name: NameJson;
    variableDefinitions: Array<VariableDefinitionJson>;
    directives: Array<DirectiveJson>;
    selectionSet: SelectionSetJson;
}

export interface FieldJson {
    kind: 'Field',
    alias: NameJson;
    name: NameJson;
    arguments: Array<ArgumentJson>;
    directives: Array<DirectiveJson>;
    selectionSet: SelectionSetJson;
}

export interface FragmentSpreadJson {
    kind: 'FragmentSpread',
    name: NameJson;
    directives: Array<DirectiveJson>;
}

export interface InlineFragmentJson {
    kind: 'InlineFragment',
    typeCondition: NamedTypeJson;
    directives: Array<DirectiveJson>;
    selectionSet: SelectionSetJson;
}

export interface VariableDefinitionJson {
    kind: 'VariableDefinition',
    variable: VariableJson;
    type: TypeJson;
    defaultValue: ValueJson;
    directives: Array<DirectiveJson>;
}
export interface SelectionSetJson {
    kind: 'SelectionSet',
    selections: Array<SelectionJson>;
}
export interface FragmentDefinitionJson {
    kind: 'FragmentDefinition',
    name: NameJson;
    variableDefinitions: Array<VariableDefinitionJson>;
    typeCondition: NamedTypeJson;
    directives: Array<DirectiveJson>;
    selectionSet: SelectionSetJson;
}

export interface SchemaDefinitionJson {
    kind: 'SchemaDefinition',
    directives: Array<DirectiveJson>;
    operationTypes: Array<OperationTypeDefinitionJson>;
}

export interface OperationTypeDefinitionJson {
    kind: 'OperationTypeDefinition',
    operation: OperationType;
    type: NamedTypeJson;
}
export interface DirectiveDefinitionJson {
    kind: 'DirectiveDefinition',
    description: StringValueJson;
    name: NameJson;
    arguments: Array<InputValueDefinitionJson>;
    locations: Array<NameJson>;
}
export interface ScalarTypeDefinitionJson {
    kind: 'ScalarTypeDefinition',
    description: StringValueJson;
    name: NameJson;
    directives: Array<DirectiveJson>;
}
export interface ObjectTypeDefinitionJson {
    kind: 'ObjectTypeDefinition',
    description: StringValueJson;
    name: NameJson;
    interfaces: Array<NamedTypeJson>;
    directives: Array<DirectiveJson>;
    fields: Array<FieldDefinitionJson>;
}
export interface InterfaceTypeDefinitionJson {
    kind: 'InterfaceTypeDefinition',
    description: StringValueJson;
    name: NameJson;
    directives: Array<DirectiveJson>;
    fields: Array<FieldDefinitionJson>;
}

export interface UnionTypeDefinitionJson {
    kind: 'UnionTypeDefinition',
    description: StringValueJson;
    name: NameJson;
    directives: Array<DirectiveJson>;
    types: Array<NamedTypeJson>;
}

export interface EnumTypeDefinitionJson {
    kind: 'EnumTypeDefinition',
    description: StringValueJson;
    name: NameJson;
    directives: Array<DirectiveJson>;
    values: Array<EnumValueDefinitionJson>;
}

export interface InputObjectTypeDefinitionJson {
    kind: 'InputObjectTypeDefinition',
    description: StringValueJson;
    name: NameJson;
    directives: Array<DirectiveJson>;
    fields: Array<InputValueDefinitionJson>;
}

export interface SchemaExtensionJson {
    kind: 'SchemaExtension',
    directives: Array<DirectiveJson>;
    operationTypes: Array<OperationTypeDefinitionJson>;
}

export interface NameJson {
    kind: 'Name',
    value: string;
}

export interface ListTypeJson {
    kind: 'ListType',
    type: TypeJson;
}

export interface NonNullTypeJson {
    kind: 'NonNullType',
    type: NamedTypeJson | ListTypeJson;
}
