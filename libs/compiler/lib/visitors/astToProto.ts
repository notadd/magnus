import { ast as graphql } from '@notadd/magnus-graphql';
import { ast } from '@notadd/magnus-grpc';
import { CollectionContext } from './collection';
import { upperFirst } from 'lodash';
import { MagnusConfig } from '@notadd/magnus-core';
export class AstToProtoVisitor implements graphql.Visitor {
    name: string = `AstToProtoVisitor`;
    root: ast.Root;
    collection: CollectionContext;
    package: ast.Package;
    documentAst: graphql.DocumentAst;
    config: MagnusConfig;
    visitDocumentAst(node: graphql.DocumentAst, context: CollectionContext) {
        this.documentAst = node;
        const root = new ast.Root()
        this.root = root;
        const pkg = new ast.Package();
        this.package = pkg;
        pkg.name = this.config.name || 'magnus';
        pkg.syntax = `proto3`;
        pkg.children.push(this.createEmpty())
        node.protos.map(proto => proto.visit(this, pkg));
        root.packages.push(pkg);
        return root;
    }

    createEmpty() {
        const service = new ast.Message();
        service.name = `Empty`;
        return service;
    }

    visitObjectTypeDefinitionAst(node: graphql.ObjectTypeDefinitionAst, context: ast.Package) {
        const name = node.name.visit(this, context);
        if (this.package.hasChild(name)) {
            return;
        }
        this.isGrpc = node.isGrpc;
        if (node.isGrpc) {
            const service = new ast.Service();
            service.name = name;
            node.fields.map((field, index) => {
                field.index = index;
                field.visit(this, service)
            });
            this.package.children.push(service);
        } else {
            const message = new ast.Message();
            message.name = name;
            node.fields.map((field, index) => {
                field.index = index;
                field.visit(this, message)
            });
            if (!this.package.hasChild(name)) {
                this.package.children.push(message);
            }
        }
    }
    set: Set<string> = new Set();
    checkType(name: string, context: ast.Service | ast.Message) {
        if (this.set.has(name)) {
            return;
        }
        this.set.add(name);
        const graphqlAst = this.documentAst.hasDefinitionAst(name);
        if (graphqlAst) graphqlAst.visit(this, context);
    }
    visitInputObjectTypeDefinitionAst(node: graphql.InputObjectTypeDefinitionAst, context: ast.Package) {
        const message = new ast.Message();
        message.name = node.name.visit(this, ``);
        node.fields.map((field, index) => {
            field.index = index;
            field.visit(this, message)
        });
        this.package.children.push(message);
    }
    visitInputValueDefinitionAst(node: graphql.InputValueDefinitionAst, context: ast.Message) {
        const field = new ast.Field();
        field.index = node.index;
        field.name = node.name.visit(this, ``);
        field.type = this.createType(node.type, field);
        this.checkType(field.type, context)
        context.fields.push(field);
    }
    visitFieldDefinitionAst(node: graphql.FieldDefinitionAst, context: ast.Service | ast.Message) {
        if (context instanceof ast.Service) {
            const method = new ast.Method();
            method.name = upperFirst(node.name.visit(this, ``));
            method.decorator = [`rpc`];
            method.type = this.createType(node.type, method);
            this.checkType(method.type, context)
            if (node.arguments.length > 0) {
                method.parameter = this.createArguments(node.arguments[0], method);
                this.checkType(method.parameter, context)
            } else {
                method.parameter = `Empty`;
            }
            context.methods.push(method);
        } else {
            const field = new ast.Field();
            field.index = node.index;
            field.name = node.name.visit(this, ``);
            field.type = this.createType(node.type, field);
            this.checkType(field.type, context)
            context.fields.push(field);
        }
    }
    isGrpc: boolean;
    createType(node: graphql.TypeAst, context: ast.Method | ast.Field): string {
        if (node instanceof graphql.ListTypeAst) {
            if (!this.isGrpc) {
                context.decorator.unshift('repeated');
            }
            return this.createType(node.type, context)
        } else if (node instanceof graphql.NonNullTypeAst) {
            return this.createType(node.type, context)
        } else {
            return node.visit(this, ``)
        }
    }

    createArguments(node: graphql.InputValueDefinitionAst, context: ast.Method | ast.Field): string {
        return this.createType(node.type, context)
    }

    visitNameAst(node: graphql.NameAst, context: any) {
        switch (node.value) {
            case 'String':
            case 'string':
                return `string`;
            case 'Double':
                return 'double';
            case 'Float':
                return 'float';
            case 'Int':
            case 'Int32':
                return `int32`;
            case 'Uint32':
                return `uint32`;
            case 'Sint32':
                return `sint32`;
            case 'fixed32':
                return `fixed32`;
            case 'Sfixed32':
                return `sfixed32`;
            case 'Int64':
                return `int64`;
            case 'Uint64':
                return `uint64`;
            case 'Sint64':
                return `sint64`;
            case 'Fixed64':
                return `fixed64`;
            case 'Sfixed64':
                return `sfixed64`;
            case 'Bool':
            case 'Boolean':
                return `bool`;
            case 'ID':
            case 'Bytes':
                return `bytes`;
            default:
                return node.value;
        }
    }

    visitNamedTypeAst(node: graphql.NamedTypeAst, context: any): any {
        return node.name.visit(this, context);
    }

    visitScalarTypeDefinitionAst(node: graphql.ScalarTypeDefinitionAst, context: any) {

    }

    visitEnumTypeDefinitionAst(node: graphql.EnumTypeDefinitionAst, context: any) { }
}
