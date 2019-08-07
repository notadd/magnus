import * as ast from "./ast";
import * as l from 'graphql/language';

export function toJson(node: ast.DocumentAst): l.DocumentNode {
    const visitor = new ToJsonVisitor();
    return node.visit(visitor, {})
}

export class ToJsonVisitor<C = any> implements ast.Visitor<C, l.ASTNode> {
    name: string = `ToJsonVisitor`
    visitTypeDefinitionAst(node: ast.TypeDefinitionAst<C, l.ASTNode>, context: C): l.ASTNode {
        return node.visit(this, context);
    }
    visitDefinitionAst(node: ast.DefinitionAst<C, l.ASTNode>, context: C): l.ASTNode {
        return node.visit(this, context);
    }
    visitObjectFieldAst(node: ast.ObjectFieldAst<C, l.ASTNode>, context: C): any {
        return {
            kind: 'ObjectField',
            name: node.name && node.name.visit(this, context),
            value: node.value && node.value.visit(this, context)
        }
    }
    visitorTypeDefinitionAst(node: ast.TypeDefinitionAst, context: C): l.ASTNode {
        return node.visit(this, context)
    }
    visitorDefinitionAst(node: ast.DefinitionAst, context: C): l.ASTNode {
        return node.visit(this, context)
    }

    visitTypeSystemDefinitionAst(node: ast.TypeSystemDefinitionAst, context: C): l.ASTNode {
        return node.visit(this, context)
    }

    visitExecutableDefinitionAst(node: ast.ExecutableDefinitionAst, context: C): l.ASTNode {
        return node.visit(this, context)
    }

    visitSchemaExtensionNode(node: ast.SchemaExtensionAst, context: C): l.SchemaDefinitionNode {
        return {
            kind: 'SchemaDefinition',
            directives: node.directives.map(dir => dir.visit(this, context)),
            operationTypes: node.operationTypes.map(oper => oper.visit(this, context))
        }
    }

    visitTypeExtensionNode(node: ast.TypeExtensionAst, context: C): l.TypeExtensionNode {
        return node.visit(this, context);
    }

    visitTypeSystemExtensionNode(node: ast.TypeSystemExtensionAst, context: C): l.ASTNode {
        return node.visit(this, context);
    }

    visitDocumentAst(node: ast.DocumentAst, context: C): l.DocumentNode {
        return {
            kind: 'Document',
            definitions: node.definitions.filter(node => !!node).map(def => {
                return def.visit(this, context)
            })
        }
    }

    visitVariableAst(node: ast.VariableAst, context: C): l.VariableNode {
        return {
            kind: 'Variable',
            name: node.name && node.name.visit(this, context)
        }
    }

    visitIntValueAst(node: ast.IntValueAst, context: C): l.IntValueNode {
        return {
            kind: 'IntValue',
            value: `${node.value}`
        }
    }

    visitFloatValueAst(node: ast.FloatValueAst, context: C): l.FloatValueNode {
        return {
            kind: 'FloatValue',
            value: `${node.value}`
        }
    }

    visitStringValueAst(node: ast.StringValueAst, context: C): l.StringValueNode {
        return {
            kind: 'StringValue',
            value: node.value,
            block: node.block
        }
    }

    visitBooleanValueAst(node: ast.BooleanValueAst, context: C): l.BooleanValueNode {
        return {
            kind: 'BooleanValue',
            value: node.value
        }
    }

    visitNullValueAst(node: ast.NullValueAst, context: C): l.NullValueNode {
        return {
            kind: 'NullValue'
        }
    }

    visitEnumValueAst(node: ast.EnumValueAst, context: C): l.EnumValueNode {
        return {
            kind: 'EnumValue',
            value: node.value
        }
    }

    visitListValueAst(node: ast.ListValueAst, context: C): l.ListValueNode {
        return {
            kind: 'ListValue',
            values: node.values.map(value => value.visit(this, context))
        }
    }

    visitObjectValueAst(node: ast.ObjectValueAst, context: C): l.ObjectValueNode {
        return {
            kind: 'ObjectValue',
            fields: node.fields.map(field => field.visit(this, context))
        }
    }

    visitAstVisitor(node: ast.ObjectFieldAst, context: C): l.ObjectFieldNode {
        return {
            kind: 'ObjectField',
            name: node.name && node.name.visit(this, context),
            value: node.value.visit(this, context)
        }
    }

    visitUnionTypeExtensionAst(node: ast.UnionTypeExtensionAst, context: C): l.UnionTypeExtensionNode {
        return {
            kind: 'UnionTypeExtension',
            name: node.name && node.name.visit(this, context),
            directives: node.directives.map(directive => directive.visit(this, context))
        }
    }

    visitScalarTypeExtensionAst(node: ast.ScalarTypeExtensionAst, context: C): l.ScalarTypeExtensionNode {
        return {
            kind: 'ScalarTypeExtension',
            name: node.name && node.name.visit(this, context),
            directives: node.directives.map(dire => dire.visit(this, context))
        }
    }

    visitObjectTypeExtensionAst(node: ast.ObjectTypeExtensionAst, context: C): l.ObjectTypeExtensionNode {
        return {
            kind: 'ObjectTypeExtension',
            name: node.name && node.name.visit(this, context),
            interfaces: node.interfaces.map(int => int.visit(this, context))
        }
    }

    visitNamedTypeAst(node: ast.NamedTypeAst, context: C): l.NamedTypeNode {
        return {
            kind: 'NamedType',
            name: node.name && node.name.visit(this, context)
        }
    }

    visitInterfaceTypeExtensionAst(node: ast.InterfaceTypeExtensionAst, context: C): l.InterfaceTypeExtensionNode {
        return {
            kind: 'InterfaceTypeExtension',
            name: node.name && node.name.visit(this, context),
            directives: node.directives.map(dire => dire.visit(this, context)),
            fields: node.fields.map(field => field.visit(this, context))
        }
    }

    visitFieldDefinitionAst(node: ast.FieldDefinitionAst, context: C): l.FieldDefinitionNode {
        try {
            return {
                kind: 'FieldDefinition',
                description: node.description && node.description.visit(this, context),
                name: node.name && node.name.visit(this, context),
                arguments: node.arguments && node.arguments.map(arg => arg.visit(this, context)),
                type: node.type && node.type.visit(this, context),
                directives: node.directives.map(dir => dir.visit(this, context))
            }
        } catch (e) {
            throw e;
        }
    }

    visitInputValueDefinitionAst(node: ast.InputValueDefinitionAst, context: C): l.InputValueDefinitionNode {
        return {
            kind: 'InputValueDefinition',
            description: node.description && node.description.visit(this, context),
            name: node.name && node.name.visit(this, context),
            type: node.type && node.type.visit(this, context),
            defaultValue: node.defaultValue && node.defaultValue.visit(this, context),
            directives: node.directives.map(dir => dir.visit(this, context))
        }
    }

    visitEnumTypeExtensionAst(node: ast.EnumTypeExtensionAst, context: C): l.EnumTypeExtensionNode {
        return {
            kind: 'EnumTypeExtension',
            name: node.name && node.name.visit(this, context),
            directives: node.directives.map(dir => dir.visit(this, context)),
            values: node.values && node.values.map(val => val.visit(this, context))
        }
    }

    visitEnumValueDefinitionAst(node: ast.EnumValueDefinitionAst, context: C): l.EnumValueDefinitionNode {
        return {
            kind: 'EnumValueDefinition',
            description: node.description && node.description.visit(this, context),
            name: node.name && node.name.visit(this, context),
            directives: node.directives.map(dir => dir.visit(this, context))
        }
    }

    visitInputObjectTypeExtensionAst(node: ast.InputObjectTypeExtensionAst, context: C): l.InputObjectTypeExtensionNode {
        return {
            kind: 'InputObjectTypeExtension',
            name: node.name && node.name.visit(this, context),
            directives: node.directives.map(dir => dir.visit(this, context)),
            fields: node.fields.map(field => field.visit(this, context))
        }
    }

    visitOperationDefinitionAst(node: ast.OperationDefinitionAst, context: C): l.OperationDefinitionNode {
        return {
            kind: 'OperationDefinition',
            operation: node.operation,
            name: node.name && node.name.visit(this, context),
            variableDefinitions: node.variableDefinitions.map(variable => variable.visit(this, context)),
            directives: node.directives.map(dir => dir.visit(this, context)),
            selectionSet: node.selectionSet.visit(this, context)
        }
    }
    visitFieldAst(node: ast.FieldAst, context: C): l.FieldNode {
        return {
            kind: 'Field',
            alias: node.alias && node.alias.visit(this, context),
            name: node.name && node.name.visit(this, context),
            arguments: node.arguments.map(arg => arg.visit(this, context)),
            directives: node.directives.map(dir => dir.visit(this, context)),
            selectionSet: node.selectionSet && node.selectionSet.visit(this, context)
        }
    }
    visitFragmentSpreadAst(node: ast.FragmentSpreadAst, context: C): l.FragmentSpreadNode {
        return {
            kind: 'FragmentSpread',
            name: node.name && node.name.visit(this, context),
            directives: node.directives.map(dir => dir.visit(this, context))
        }
    }
    visitInlineFragmentAst(node: ast.InlineFragmentAst, context: C): l.InlineFragmentNode {
        return {
            kind: 'InlineFragment',
            typeCondition: node.typeCondition.visit(this, context),
            directives: node.directives.map(dir => dir.visit(this, context)),
            selectionSet: node.selectionSet.visit(this, context)
        }
    }
    visitVariableDefinitionAst(node: ast.VariableDefinitionAst, context: C): l.VariableDefinitionNode {
        return {
            kind: 'VariableDefinition',
            variable: node.variable && node.variable.visit(this, context),
            type: node.type && node.type.visit(this, context),
            defaultValue: node.defaultValue && node.defaultValue.visit(this, context),
            directives: node.directives.map(dir => dir.visit(this, context))
        }
    }
    visitSelectionSetAst(node: ast.SelectionSetAst, context: C): l.SelectionSetNode {
        return {
            kind: 'SelectionSet',
            selections: node.selections.map(sel => sel.visit(this, context))
        }
    }
    visitFragmentDefinitionAst(node: ast.FragmentDefinitionAst, context: C): l.FragmentDefinitionNode {
        return {
            kind: 'FragmentDefinition',
            name: node.name && node.name.visit(this, context),
            variableDefinitions: node.variableDefinitions.map(variable => variable.visit(this, context)),
            typeCondition: node.typeCondition && node.typeCondition.visit(this, context),
            directives: node.directives.map(dir => dir.visit(this, context)),
            selectionSet: node.selectionSet && node.selectionSet.visit(this, context)
        }
    }
    visitSchemaDefinitionAst(node: ast.SchemaDefinitionAst, context: C): l.SchemaDefinitionNode {
        return {
            kind: 'SchemaDefinition',
            directives: node.directives.map(dir => dir.visit(this, context)),
            operationTypes: node.operationTypes.map(t => t.visit(this, context))
        }
    }
    visitOperationTypeDefinitionAst(node: ast.OperationTypeDefinitionAst, context: C): l.OperationTypeDefinitionNode {
        return {
            kind: 'OperationTypeDefinition',
            operation: node.operation,
            type: node.type && node.type.visit(this, context)
        }
    }
    visitDirectiveDefinitionAst(node: ast.DirectiveDefinitionAst, context: C): l.DirectiveDefinitionNode {
        return {
            kind: 'DirectiveDefinition',
            description: node.description && node.description.visit(this, context),
            name: node.name && node.name.visit(this, context),
            arguments: node.arguments.map(arg => arg.visit(this, context)),
            locations: node.locations.map(loc => loc.visit(this, context)),
            repeatable: true
        }
    }
    visitScalarTypeDefinitionAst(node: ast.ScalarTypeDefinitionAst, context: C): l.ScalarTypeDefinitionNode {
        return {
            kind: 'ScalarTypeDefinition',
            description: node.description && node.description.visit(this, context),
            name: node.name && node.name.visit(this, context),
            directives: node.directives.map(dir => dir.visit(this, context))
        }
    }
    visitObjectTypeDefinitionAst(node: ast.ObjectTypeDefinitionAst, context: C): l.ObjectTypeDefinitionNode {
        try {
            return {
                kind: 'ObjectTypeDefinition',
                description: node.description && node.description.visit(this, context),
                name: node.name && node.name.visit(this, context),
                interfaces: node.interfaces && node.interfaces.map(int => int.visit(this, context)),
                directives: node.directives && node.directives.map(dir => dir.visit(this, context)),
                fields: node.fields && node.fields.map(field => field.visit(this, context))
            }
        } catch (e) {
            debugger;
            throw e;
        }
    }
    visitInterfaceTypeDefinitionAst(node: ast.InterfaceTypeDefinitionAst, context: C): l.InterfaceTypeDefinitionNode {
        return {
            kind: 'InterfaceTypeDefinition',
            description: node.description && node.description.visit(this, context),
            name: node.name && node.name.visit(this, context),
            directives: node.directives.map(dir => dir.visit(this, context)),
            fields: node.fields.map(field => field.visit(this, context))
        }
    }
    visitUnionTypeDefinitionAst(node: ast.UnionTypeDefinitionAst, context: C): any {
        return {
            kind: 'UnionTypeDefinition',
            description: node.description && node.description.visit(this, context),
            name: node.name && node.name.visit(this, context),
            directives: node.directives.map(dir => dir.visit(this, context)),
            types: (node.types || []).map(type => {
                if (type.visit) return type.visit(this, context)
            }).filter(res => !!res)
        }
    }
    visitEnumTypeDefinitionAst(node: ast.EnumTypeDefinitionAst, context: C): l.EnumTypeDefinitionNode {
        return {
            kind: 'EnumTypeDefinition',
            description: node.description && node.description.visit(this, context),
            name: node.name && node.name.visit(this, context),
            directives: node.directives.map(dir => dir.visit(this, context)),
            values: node.values.map(val => val.visit(this, context))
        }
    }
    visitInputObjectTypeDefinitionAst(node: ast.InputObjectTypeDefinitionAst, context: C): l.InputObjectTypeDefinitionNode {
        try {
            return {
                kind: 'InputObjectTypeDefinition',
                description: node.description && node.description.visit(this, context),
                name: node.name && node.name.visit(this, context),
                directives: node.directives.map(dir => dir.visit(this, context)),
                fields: node.fields.map(field => field.visit(this, context))
            }
        } catch (e) {
            throw e;
        }
    }
    visitSchemaExtensionAst(node: ast.SchemaExtensionAst, context: C): l.SchemaExtensionNode {
        return {
            kind: 'SchemaExtension',
            directives: node.directives.map(dire => dire.visit(this, context)),
            operationTypes: node.operationTypes.map(type => type.visit(this, context))
        }
    }
    visitNameAst(node: ast.NameAst, context: C): l.NameNode {
        return {
            kind: 'Name',
            value: node.value
        }
    }
    visitListTypeAst(node: ast.ListTypeAst, context: C): l.ListTypeNode {
        return {
            kind: 'ListType',
            type: node.type && node.type.visit(this, context)
        }
    }
    visitNonNullTypeAst(node: ast.NonNullTypeAst, context: C): l.NonNullTypeNode {
        return {
            kind: 'NonNullType',
            type: node.type && node.type.visit(this, context)
        }
    }
    visitArgumentAst(node: ast.ArgumentAst, context: C): l.ArgumentNode {
        return {
            kind: 'Argument',
            name: node.name && node.name.visit(this, context),
            value: node.value && node.value.visit(this, context)
        }
    }
    visitDirectiveAst(node: ast.DirectiveAst, context: C): l.DirectiveNode {
        return {
            kind: 'Directive',
            name: node.name && node.name.visit(this, context),
            arguments: node.arguments.map(arg => arg.visit(this, context))
        }
    }
}
