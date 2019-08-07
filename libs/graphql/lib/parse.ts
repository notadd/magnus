import * as graphql from 'graphql';
import * as ast from './ast';
export class ParseVisitor implements ast.Visitor {
    name: string = `ParseVisitor`;
    visit(node: any, context: graphql.ASTNode): any {
        if (context.kind === 'InputObjectTypeDefinition') {
            return this.visitInputObjectTypeDefinitionAst(new ast.InputObjectTypeDefinitionAst(), context)
        }
        else if (context.kind === 'InputObjectTypeExtension') {
            return this.visitInputObjectTypeExtensionAst(new ast.InputObjectTypeExtensionAst(), context)
        }
        else if (context.kind === 'InputValueDefinition') {
            return this.visitInputValueDefinitionAst(new ast.InputValueDefinitionAst(), context)
        }
        else if (context.kind === 'IntValue') {
            return this.visitIntValueAst(new ast.IntValueAst(), context)
        }
        else if (context.kind === 'InterfaceTypeDefinition') {
            return this.visitInterfaceTypeDefinitionAst(new ast.InterfaceTypeDefinitionAst(), context)
        }
        else if (context.kind === 'InterfaceTypeExtension') {
            return this.visitInterfaceTypeExtensionAst(new ast.InterfaceTypeExtensionAst(), context)
        }
        else if (context.kind === 'ListType') {
            return this.visitListTypeAst(new ast.ListTypeAst(), context)
        }
        else if (context.kind === 'ListValue') {
            return this.visitListValueAst(new ast.ListValueAst(), context)
        }
        else if (context.kind === 'Name') {
            return this.visitNameAst(new ast.NameAst(), context)
        }
        else if (context.kind === 'NamedType') {
            return this.visitNamedTypeAst(new ast.NamedTypeAst(), context)
        }
        else if (context.kind === 'NonNullType') {
            return this.visitNonNullTypeAst(new ast.NonNullTypeAst(), context)
        }
        else if (context.kind === 'NullValue') {
            return this.visitNullValueAst(new ast.NullValueAst(), context)
        }
        else if (context.kind === 'ObjectField') {
            return this.visitObjectFieldAst(new ast.ObjectFieldAst(), context)
        }
        else if (context.kind === 'ObjectTypeDefinition') {
            return this.visitObjectTypeDefinitionAst(new ast.ObjectTypeDefinitionAst(), context)
        }
        else if (context.kind === 'ObjectTypeExtension') {
            return this.visitObjectTypeExtensionAst(new ast.ObjectTypeExtensionAst(), context)
        }
        else if (context.kind === 'ObjectValue') {
            return this.visitObjectValueAst(new ast.ObjectValueAst(), context)
        }
        else if (context.kind === 'OperationDefinition') {
            return this.visitOperationDefinitionAst(new ast.OperationDefinitionAst(), context)
        }
        else if (context.kind === 'OperationTypeDefinition') {
            return this.visitOperationTypeDefinitionAst(new ast.OperationTypeDefinitionAst(), context)
        }
        else if (context.kind === 'ScalarTypeDefinition') {
            return this.visitScalarTypeDefinitionAst(new ast.ScalarTypeDefinitionAst(), context)
        }
        else if (context.kind === 'ScalarTypeExtension') {
            return this.visitScalarTypeExtensionAst(new ast.ScalarTypeExtensionAst(), context)
        }
        else if (context.kind === 'SchemaDefinition') {
            return this.visitSchemaDefinitionAst(new ast.SchemaDefinitionAst(), context)
        }
        else if (context.kind === 'SchemaExtension') {
            return this.visitSchemaExtensionAst(new ast.SchemaExtensionAst(), context)
        }
        else if (context.kind === 'SelectionSet') {
            return this.visitSelectionSetAst(new ast.SelectionSetAst(), context)
        }
        else if (context.kind === 'StringValue') {
            return this.visitStringValueAst(new ast.StringValueAst(), context)
        }
        else if (context.kind === 'UnionTypeDefinition') {
            return this.visitUnionTypeDefinitionAst(new ast.UnionTypeDefinitionAst(), context)
        }
        else if (context.kind === 'UnionTypeExtension') {
            return this.visitUnionTypeExtensionAst(new ast.UnionTypeExtensionAst(), context)
        }
        else if (context.kind === 'Variable') {
            return this.visitVariableAst(new ast.VariableAst(), context)
        }
        else if (context.kind === 'Document') {
            return this.visitDocumentAst(new ast.DocumentAst(), context)
        }
        else if (context.kind === 'VariableDefinition') {
            return this.visitVariableDefinitionAst(new ast.VariableDefinitionAst(), context)
        }
        else if (context.kind === 'Field') {
            return this.visitFieldAst(new ast.FieldAst(), context)
        }
        else if (context.kind === 'FloatValue') {
            return this.visitFloatValueAst(new ast.FloatValueAst(), context)
        }
        else if (context.kind === 'EnumValue') {
            return this.visitEnumValueAst(new ast.EnumValueAst(), context)
        }
        else if (context.kind === 'BooleanValue') {
            return this.visitBooleanValueAst(new ast.BooleanValueAst(), context)
        }
        else if (context.kind === 'Argument') {
            return this.visitArgumentAst(new ast.ArgumentAst(), context)
        }
        else if (context.kind === 'Directive') {
            return this.visitDirectiveAst(new ast.DirectiveAst(), context)
        }
        else if (context.kind === 'DirectiveDefinition') {
            return this.visitDirectiveDefinitionAst(new ast.DirectiveDefinitionAst(), context)
        }
        else if (context.kind === 'EnumTypeDefinition') {
            return this.visitEnumTypeDefinitionAst(new ast.EnumTypeDefinitionAst(), context)
        }
        else if (context.kind === 'EnumTypeExtension') {
            return this.visitEnumTypeExtensionAst(new ast.EnumTypeExtensionAst(), context)
        }
        else if (context.kind === 'EnumValueDefinition') {
            return this.visitEnumValueDefinitionAst(new ast.EnumValueDefinitionAst(), context)
        }
        else if (context.kind === 'FieldDefinition') {
            return this.visitFieldDefinitionAst(new ast.FieldDefinitionAst(), context)
        }
        else if (context.kind === 'FragmentDefinition') {
            return this.visitFragmentDefinitionAst(new ast.FragmentDefinitionAst(), context)
        }
        else if (context.kind === 'FragmentSpread') {
            return this.visitFragmentSpreadAst(new ast.FragmentSpreadAst(), context)
        }
        else if (context.kind === 'InlineFragment') {
            return this.visitInlineFragmentAst(new ast.InlineFragmentAst(), context)
        } else {
            console.log(`not found visitor`, context)
        }
    }
    visitNameAst(node: ast.NameAst, context: graphql.NameNode) {
        node.value = context.value;
        return node;
    }
    createKeywordAst(node: ast.NameAst, context: string) {
        node.value = context;
        return node;
    }
    visitVariableDefinitionAst(node: ast.VariableDefinitionAst, context: graphql.VariableDefinitionNode) {
        node.variable = this.visitVariableAst(new ast.VariableAst(), context.variable)
        node.type = this.visitTypeAst(undefined, context.type)
        if (context.defaultValue) {
            node.defaultValue = this.visitValueAst(undefined, context.defaultValue)
        }
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        return node;
    }
    visitDirectiveAst(node: ast.DirectiveAst, context: graphql.DirectiveNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        if (context.arguments) {
            node.arguments = context.arguments.map(arg => this.visitArgumentAst(new ast.ArgumentAst(), arg))
        }
        return node;
    }
    visitSelectionSetAst(node: ast.SelectionSetAst, context: graphql.SelectionSetNode) {
        if (context.selections) {
            node.selections = context.selections.map(selection => this.visitSelectionAst(undefined, selection))
        }
        return node;
    }
    visitVariableAst(node: ast.VariableAst, context: graphql.VariableNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        return node;
    }
    visitIntValueAst(node: ast.IntValueAst, context: graphql.IntValueNode) {
        node.value = parseFloat(context.value);
        return node;
    }
    visitFloatValueAst(node: ast.FloatValueAst, context: graphql.FloatValueNode) {
        node.value = parseFloat(context.value);
        return node;
    }
    visitBooleanValueAst(node: ast.BooleanValueAst, context: graphql.BooleanValueNode) {
        node.value = context.value;
        return node;
    }
    visitValueAst(node: undefined, context: graphql.ValueNode) {
        if (context.kind === 'Variable') {
            return this.visitVariableAst(new ast.VariableAst(), context)
        }
        else if (context.kind === 'IntValue') {
            return this.visitIntValueAst(new ast.IntValueAst(), context)
        }
        else if (context.kind === 'FloatValue') {
            return this.visitFloatValueAst(new ast.FloatValueAst(), context)
        }
        else if (context.kind === 'StringValue') {
            return this.visitStringValueAst(new ast.StringValueAst(), context)
        }
        else if (context.kind === 'BooleanValue') {
            return this.visitBooleanValueAst(new ast.BooleanValueAst(), context)
        }
        else if (context.kind === 'EnumValue') {
            return this.visitEnumValueAst(new ast.EnumValueAst(), context)
        }
        else if (context.kind === 'ListValue') {
            return this.visitListValueAst(new ast.ListValueAst(), context)
        }
        else if (context.kind === 'ObjectValue') {
            return this.visitObjectValueAst(new ast.ObjectValueAst(), context)
        }
        else {
            return this.visitNullValueAst(new ast.NullValueAst(), context)
        }
    }
    visitEnumValueAst(node: ast.EnumValueAst, context: graphql.EnumValueNode) {
        node.value = context.value;
        return node;
    }
    visitListValueAst(node: ast.ListValueAst, context: graphql.ListValueNode) {
        node.values = context.values.map(value => this.visitValueAst(undefined, value))
        return node;
    }
    visitObjectValueAst(node: ast.ObjectValueAst, context: graphql.ObjectValueNode) {
        node.fields = context.fields.map(field => this.visitObjectFieldAst(new ast.ObjectFieldAst(), field))
        return node;
    }
    visitObjectFieldAst(node: ast.ObjectFieldAst, context: graphql.ObjectFieldNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        node.value = this.visitValueAst(undefined, context.value);
        return node;
    }
    visitNullValueAst(node: ast.NullValueAst, context: graphql.NullValueNode) {
        return node;
    }
    visitArgumentAst(node: ast.ArgumentAst, context: graphql.ArgumentNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        node.value = this.visitValueAst(undefined, context.value)
        return node;
    }
    visitFieldAst(node: ast.FieldAst, context: graphql.FieldNode) {
        if (context.alias) {
            node.alias = this.visitNameAst(new ast.NameAst(), context.alias)
        }
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        if (context.arguments) {
            node.arguments = context.arguments.map(arg => this.visitArgumentAst(new ast.ArgumentAst(), arg))
        }
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        if (context.selectionSet) {
            node.selectionSet = this.visitSelectionSetAst(new ast.SelectionSetAst(), context.selectionSet);
        }
        return node;
    }
    visitFragmentSpreadAst(node: ast.FragmentSpreadAst, context: graphql.FragmentSpreadNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir));
        }
        return node;
    }
    visitInlineFragmentAst(node: ast.InlineFragmentAst, context: graphql.InlineFragmentNode) {
        if (context.typeCondition) {
            node.typeCondition = this.visitNamedTypeAst(new ast.NamedTypeAst(), context.typeCondition)
        }
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir));
        }
        if (context.selectionSet) {
            node.selectionSet = this.visitSelectionSetAst(new ast.SelectionSetAst(), context.selectionSet)
        }
        return node;
    }
    visitSelectionAst(node: undefined, context: graphql.SelectionNode) {
        if (context.kind === 'Field') {
            return this.visitFieldAst(new ast.FieldAst(), context)
        } else if (context.kind === 'FragmentSpread') {
            return this.visitFragmentSpreadAst(new ast.FragmentSpreadAst(), context);
        } else {
            return this.visitInlineFragmentAst(new ast.InlineFragmentAst(), context)
        }
    }
    visitOperationDefinitionAst(node: ast.OperationDefinitionAst, context: graphql.OperationDefinitionNode) {
        node.operation = context.operation;
        if (context.name) {
            node.name = this.visitNameAst(new ast.NameAst(), context.name)
        }
        if (context.variableDefinitions) {
            node.variableDefinitions = context.variableDefinitions.map(it => this.visitVariableDefinitionAst(new ast.VariableDefinitionAst(), it))
        }
        if (context.directives) {
            node.directives = context.directives.map(di => this.visitDirectiveAst(new ast.DirectiveAst(), di))
        }
        node.selectionSet = this.visitSelectionSetAst(new ast.SelectionSetAst(), context.selectionSet)
        return node;
    }
    visitNamedTypeAst(node: ast.NamedTypeAst, context: graphql.NamedTypeNode) {
        switch (context.name.value) {
            case 'id':
            case 'Id':
                node.name = this.createKeywordAst(new ast.NameAst(), 'ID');
                break;
            case 'bytes':
            case 'Bytes':
            case 'string':
            case 'String':
                node.name = this.createKeywordAst(new ast.NameAst(), 'String');
                break;
            case 'int32':
            case 'Int32':
            case 'int64':
            case 'Int64':
            case 'uint32':
            case 'Uint32':
            case 'uint64':
            case 'Uint64':
            case 'sint32':
            case 'Sint32':
            case 'sint64':
            case 'Sint64':
            case 'fixed32':
            case 'Fixed32':
            case 'fixed64':
            case 'Fixed64':
            case 'sfixed32':
            case 'Sfixed32':
            case 'sfixed64':
            case 'Sfixed64':
            case 'number':
            case 'Number':
                node.name = this.createKeywordAst(new ast.NameAst(), 'Int');
                break;
            case 'bool':
            case 'Bool':
            case 'boolean':
            case 'Boolean':
                node.name = this.createKeywordAst(new ast.NameAst(), 'Boolean');
                break;
            case 'double':
            case 'Double':
            case 'float':
            case 'Float':
                node.name = this.createKeywordAst(new ast.NameAst(), 'Float');
                break;
            default:
                node.name = this.visitNameAst(new ast.NameAst(), context.name);
                break;
        }
        return node;
    }
    visitFragmentDefinitionAst(node: ast.FragmentDefinitionAst, context: graphql.FragmentDefinitionNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        if (context.variableDefinitions) {
            node.variableDefinitions = context.variableDefinitions.map(di => this.visitVariableDefinitionAst(new ast.VariableDefinitionAst(), di))
        }
        node.typeCondition = this.visitNamedTypeAst(new ast.NamedTypeAst(), context.typeCondition);
        if (context.directives) {
            node.directives = context.directives.map(di => this.visitDirectiveAst(new ast.DirectiveAst(), di))
        }
        node.selectionSet = this.visitSelectionSetAst(new ast.SelectionSetAst(), context.selectionSet)
        return node;
    }
    visitSchemaDefinitionAst(node: ast.SchemaDefinitionAst, context: graphql.SchemaDefinitionNode) {
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir));
        }
        node.operationTypes = context.operationTypes.map(oper => this.visitOperationTypeDefinitionAst(new ast.OperationTypeDefinitionAst(), oper))
        return node;
    }
    visitOperationTypeDefinitionAst(node: ast.OperationTypeDefinitionAst, context: graphql.OperationTypeDefinitionNode) {
        node.operation = context.operation;
        node.type = this.visitNamedTypeAst(new ast.NamedTypeAst(), context.type);
        return node;
    }
    visitDirectiveDefinitionAst(node: ast.DirectiveDefinitionAst, context: graphql.DirectiveDefinitionNode) {
        if (context.description) {
            node.description = this.visitStringValueAst(new ast.StringValueAst(), context.description)
        }
        node.name = this.visitNameAst(new ast.NameAst(), context.name)
        if (context.arguments) {
            node.arguments = context.arguments.map(arg => this.visitInputValueDefinitionAst(new ast.InputValueDefinitionAst(), arg))
        }
        node.locations = context.locations.map(loc => this.visitNameAst(new ast.NameAst(), loc))
        return node;
    }
    visitScalarTypeDefinitionAst(node: ast.ScalarTypeDefinitionAst, context: graphql.ScalarTypeDefinitionNode) {
        if (context.description) {
            node.description = this.visitStringValueAst(new ast.StringValueAst(), context.description)
        }
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        return node;
    }
    visitStringValueAst(node: ast.StringValueAst, context: graphql.StringValueNode) {
        node.value = context.value;
        return node;
    }
    visitInputValueDefinitionAst(node: ast.InputValueDefinitionAst, context: graphql.InputValueDefinitionNode) {
        return node;
    }
    visitListTypeAst(node: ast.ListTypeAst, context: graphql.ListTypeNode) {
        node.type = this.visitTypeAst(undefined, context.type);
        return node;
    }
    visitNonNullTypeAst(node: ast.NonNullTypeAst, context: graphql.NonNullTypeNode) {
        node.type = this.visitTypeAst(undefined, context.type);
        return node;
    }
    visitTypeAst(node: undefined, context: graphql.TypeNode) {
        if (context.kind === 'NamedType') {
            return this.visitNamedTypeAst(new ast.NamedTypeAst(), context)
        }
        else if (context.kind === 'ListType') {
            return this.visitListTypeAst(new ast.ListTypeAst(), context)
        } else {
            // NonNullType
            return this.visitNonNullTypeAst(new ast.NonNullTypeAst(), context)
        }
    }
    visitFieldDefinitionAst(node: ast.FieldDefinitionAst, context: graphql.FieldDefinitionNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        if (context.description) {
            node.description = this.visitStringValueAst(new ast.StringValueAst(), context.description);
        }
        if (context.arguments) {
            node.arguments = context.arguments.map(arg => this.visitInputValueDefinitionAst(new ast.InputValueDefinitionAst(), arg));
        }
        node.type = this.visitTypeAst(undefined, context.type)
        if (context.directives) {
            node.directives = context.directives.map(di => this.visitDirectiveAst(new ast.DirectiveAst(), di));
        }
        return node;
    }
    visitObjectTypeDefinitionAst(node: ast.ObjectTypeDefinitionAst, context: graphql.ObjectTypeDefinitionNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        if (context.description) {
            node.description = this.visitStringValueAst(new ast.StringValueAst(), context.description);
        }
        if (context.interfaces) {
            node.interfaces = context.interfaces.map(di => this.visitNamedTypeAst(new ast.NamedTypeAst(), di));
        }
        if (context.directives) {
            node.directives = context.directives.map(di => this.visitDirectiveAst(new ast.DirectiveAst(), di));
        }
        if (context.fields) {
            node.fields = context.fields.map(di => this.visitFieldDefinitionAst(new ast.FieldDefinitionAst(), di));
        }
        return node;
    }
    visitInterfaceTypeDefinitionAst(node: ast.InterfaceTypeDefinitionAst, context: graphql.InterfaceTypeDefinitionNode) {
        if (context.description) {
            node.description = this.visitStringValueAst(new ast.StringValueAst(), context.description);
        }
        node.name = this.visitNameAst(new ast.NameAst(), context.name)
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        if (context.fields) {
            node.fields = context.fields.map(it => this.visitFieldDefinitionAst(new ast.FieldDefinitionAst(), it))
        }
        return node;
    }
    visitUnionTypeDefinitionAst(node: ast.UnionTypeDefinitionAst, context: graphql.UnionTypeDefinitionNode) {
        if (context.description) {
            node.description = this.visitStringValueAst(new ast.StringValueAst(), context.description)
        }
        node.name = this.visitNameAst(new ast.NameAst(), context.name)
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        if (context.types) {
            node.types = context.types.map(t => this.visitNamedTypeAst(new ast.NamedTypeAst(), t))
        }
        return node;
    }
    visitEnumTypeDefinitionAst(node: ast.EnumTypeDefinitionAst, context: graphql.EnumTypeDefinitionNode) {
        if (context.description) {
            node.description = this.visitStringValueAst(new ast.StringValueAst(), context.description)
        }
        if (context.name) {
            node.name = this.visitNameAst(new ast.NameAst(), context.name)
        }
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        if (context.values) {
            node.values = context.values.map(dir => this.visitEnumValueDefinitionAst(new ast.EnumValueDefinitionAst(), dir))
        }
        return node;
    }
    visitEnumValueDefinitionAst(node: ast.EnumValueDefinitionAst, context: graphql.EnumValueDefinitionNode) {
        if (context.description) {
            node.description = this.visitStringValueAst(new ast.StringValueAst(), context.description)
        }
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        return node;
    }
    visitInputObjectTypeDefinitionAst(node: ast.InputObjectTypeDefinitionAst, context: graphql.InputObjectTypeDefinitionNode) {
        if (context.description) {
            node.description
        }
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        if (context.fields) {
            node.fields = context.fields.map(dir => this.visitInputValueDefinitionAst(new ast.InputValueDefinitionAst(), dir))
        }
        return node;
    }
    visitSchemaExtensionAst(node: ast.SchemaExtensionAst, context: graphql.SchemaExtensionNode) {
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        if (context.operationTypes) {
            node.operationTypes = context.operationTypes.map(dir => this.visitOperationTypeDefinitionAst(new ast.OperationTypeDefinitionAst(), dir))
        }
        return node;
    }
    visitScalarTypeExtensionAst(node: ast.ScalarTypeExtensionAst, context: graphql.ScalarTypeExtensionNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir));
        }
        return node;
    }
    visitObjectTypeExtensionAst(node: ast.ObjectTypeExtensionAst, context: graphql.ObjectTypeExtensionNode) {
        if (node.name) {
            node.name = this.visitNameAst(new ast.NameAst(), context.name);
        }
        if (context.interfaces) {
            node.interfaces = context.interfaces.map(dir => this.visitNamedTypeAst(new ast.NamedTypeAst(), dir))
        }
        return node;
    }
    visitInterfaceTypeExtensionAst(node: ast.InterfaceTypeExtensionAst, context: graphql.InterfaceTypeExtensionNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        if (context.fields) {
            node.fields = context.fields.map(field => this.visitFieldDefinitionAst(new ast.FieldDefinitionAst(), field))
        }
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        return node;
    }
    visitUnionTypeExtensionAst(node: ast.UnionTypeExtensionAst, context: graphql.UnionTypeExtensionNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name)
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        if (context.types) {
            node.types = context.types.map(t => this.visitNamedTypeAst(new ast.NamedTypeAst(), t))
        }
        return node;
    }
    visitEnumTypeExtensionAst(node: ast.EnumTypeExtensionAst, context: graphql.EnumTypeExtensionNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name);
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        if (context.values) {
            node.values = context.values.map(dir => this.visitEnumValueDefinitionAst(new ast.EnumValueDefinitionAst(), dir))
        }
        return node;
    }
    visitInputObjectTypeExtensionAst(node: ast.InputObjectTypeExtensionAst, context: graphql.InputObjectTypeExtensionNode) {
        node.name = this.visitNameAst(new ast.NameAst(), context.name)
        if (context.directives) {
            node.directives = context.directives.map(dir => this.visitDirectiveAst(new ast.DirectiveAst(), dir))
        }
        if (context.fields) {
            node.fields = context.fields.map(dir => this.visitInputValueDefinitionAst(new ast.InputValueDefinitionAst(), dir))
        }
        return node;
    }
    visitDocumentAst(node: ast.DocumentAst, context: graphql.DocumentNode) {
        node.definitions = (context.definitions || []).map(def => {
            /**
             * type DefinitionNode = ExecutableDefinitionNode | TypeSystemDefinitionNode | TypeSystemExtensionNode;
             */

            /**
             * type ExecutableDefinitionNode = OperationDefinitionNode | FragmentDefinitionNode;
             */
            if (def.kind === 'OperationDefinition') {
                // 1.1 OperationDefinitionNode
                return this.visitOperationDefinitionAst(new ast.OperationDefinitionAst(), def)
            }
            else if (def.kind === 'FragmentDefinition') {
                // 1.2 FragmentDefinitionNode
                return this.visitFragmentDefinitionAst(new ast.FragmentDefinitionAst(), def)
            }
            /**
             * type TypeSystemDefinitionNode = SchemaDefinitionNode | TypeDefinitionNode | DirectiveDefinitionNode;
             */
            else if (def.kind === 'SchemaDefinition') {
                // 2.1 SchemaDefinitionNode
                return this.visitSchemaDefinitionAst(new ast.SchemaDefinitionAst(), def)
            }
            else if (def.kind === 'DirectiveDefinition') {
                // DirectiveDefinitionNode
                return this.visitDirectiveDefinitionAst(new ast.DirectiveDefinitionAst(), def)
            }
            /**
             * type TypeDefinitionNode =
                | ScalarTypeDefinitionNode
                | ObjectTypeDefinitionNode
                | InterfaceTypeDefinitionNode
                | UnionTypeDefinitionNode
                | EnumTypeDefinitionNode
                | InputObjectTypeDefinitionNode;
             */
            else if (def.kind === 'ScalarTypeDefinition') {
                // 2.2.1 ScalarTypeDefinitionNode
                return this.visitScalarTypeDefinitionAst(new ast.ScalarTypeDefinitionAst(), def)
            }
            else if (def.kind === 'ObjectTypeDefinition') {
                // 2.2.2 ObjectTypeDefinitionNode
                return this.visitObjectTypeDefinitionAst(new ast.ObjectTypeDefinitionAst(), def)
            }
            else if (def.kind === 'InterfaceTypeDefinition') {
                // 2.2.3 InterfaceTypeDefinitionNode
                return this.visitInterfaceTypeDefinitionAst(new ast.InterfaceTypeDefinitionAst(), def)
            }
            else if (def.kind === 'UnionTypeDefinition') {
                // 2.2.4 UnionTypeDefinitionNode
                return this.visitUnionTypeDefinitionAst(new ast.UnionTypeDefinitionAst(), def)
            }
            else if (def.kind === 'EnumTypeDefinition') {
                // 2.2.5 EnumTypeDefinitionNode
                return this.visitEnumTypeDefinitionAst(new ast.EnumTypeDefinitionAst(), def)
            }
            else if (def.kind === 'InputObjectTypeDefinition') {
                // 2.2.6 InputObjectTypeDefinitionNode
                return this.visitInputObjectTypeDefinitionAst(new ast.InputObjectTypeDefinitionAst(), def)
            }

            /**
             * type TypeSystemExtensionNode = SchemaExtensionNode | TypeExtensionNode
             */
            else if (def.kind === 'SchemaExtension') {
                // SchemaExtensionNode
                return this.visitSchemaExtensionAst(new ast.SchemaExtensionAst(), def)
            }
            /**
             * type TypeExtensionNode =
                | ScalarTypeExtensionNode
                | ObjectTypeExtensionNode
                | InterfaceTypeExtensionNode
                | UnionTypeExtensionNode
                | EnumTypeExtensionNode
                | InputObjectTypeExtensionNode;
             */
            else if (def.kind === 'ScalarTypeExtension') {
                return this.visitScalarTypeExtensionAst(new ast.ScalarTypeExtensionAst(), def)
            }
            else if (def.kind === 'ObjectTypeExtension') {
                return this.visitObjectTypeExtensionAst(new ast.ObjectTypeExtensionAst(), def)
            }
            else if (def.kind === 'InterfaceTypeExtension') {
                return this.visitInterfaceTypeExtensionAst(new ast.InterfaceTypeExtensionAst(), def)
            }
            else if (def.kind === 'UnionTypeExtension') {
                return this.visitUnionTypeExtensionAst(new ast.UnionTypeExtensionAst(), def)
            }
            else if (def.kind === 'EnumTypeExtension') {
                return this.visitEnumTypeExtensionAst(new ast.EnumTypeExtensionAst(), def)
            }
            else {
                return this.visitInputObjectTypeExtensionAst(new ast.InputObjectTypeExtensionAst(), def)
            }
        });
        return node;
    }
}
export function parse(source: string | graphql.Source, options?: graphql.ParseOptions) {
    const parseVisitor = new ParseVisitor();
    const documentNode = graphql.parse(source, options);
    return parseVisitor.visitDocumentAst(new ast.DocumentAst(), documentNode);
}
