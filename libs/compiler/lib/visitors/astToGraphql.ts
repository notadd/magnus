import { MangusContextManager } from './magnus';
import { ast, ParseVisitor } from '@notadd/magnus-graphql';
import { DirectiveOptions, InjectableOptions, ModuleOptions, ScalarOptions } from '@notadd/magnus-core';
import { TsToGraphqlVisitor } from './tsToGraphql'
import { CollectionContext } from './collection';
import { MagnusContext } from './magnus';
import * as ts from './visitor';
import { expressionVisitor } from './expression';
const parse = new ParseVisitor();
export class AstToGraphqlVisitor implements ast.Visitor {
    name: string = `AstToGraphqlVisitor`;
    collection: CollectionContext;
    documentAst: ast.DocumentAst;
    protos: { [key: string]: ast.FieldDefinitionAst[] }
    getProtos(): ast.ObjectTypeDefinitionAst[] {
        return Object.keys(this.protos).map(key => {
            const type = new ast.ObjectTypeDefinitionAst();
            const name = new ast.NameAst();
            name.value = key;
            type.name = name;
            type.fields = this.protos[key];
            type.isGrpc = true;
            return type;
        });
    }
    createScalar(name: string) {
        const scalar = new ast.ScalarTypeDefinitionAst();
        const nameAst = new ast.NameAst();
        nameAst.value = name;
        scalar.name = nameAst;
        return scalar;
    }
    tsToGraphqlVisitor: TsToGraphqlVisitor;
    querys: Map<string, ast.FieldDefinitionAst> = new Map();
    mutations: Map<string, ast.FieldDefinitionAst> = new Map();
    subscriptions: Map<string, ast.FieldDefinitionAst> = new Map();
    sourceFile: ts.SourceFile;
    visitContextManager(node: MangusContextManager, collection: CollectionContext): ast.DocumentAst {
        this.tsToGraphqlVisitor = new TsToGraphqlVisitor();
        this.tsToGraphqlVisitor.collection = collection;
        this.documentAst = new ast.DocumentAst();
        this.tsToGraphqlVisitor.documentAst = this.documentAst;
        this.collection = collection;
        this.documentAst.definitions.push(this.createScalar(`Double`))
        this.documentAst.definitions.push(this.createScalar(`Float`))
        this.documentAst.definitions.push(this.createScalar(`Int32`))
        this.documentAst.definitions.push(this.createScalar(`Int64`))
        this.documentAst.definitions.push(this.createScalar(`Uint32`))
        this.documentAst.definitions.push(this.createScalar(`Sint32`))
        this.documentAst.definitions.push(this.createScalar(`Fixed32`))
        this.documentAst.definitions.push(this.createScalar(`Sfixed32`))
        this.documentAst.definitions.push(this.createScalar(`Uint64`))
        this.documentAst.definitions.push(this.createScalar(`Sint64`))
        this.documentAst.definitions.push(this.createScalar(`Fixed64`))
        this.documentAst.definitions.push(this.createScalar(`Sfixed64`))
        this.documentAst.definitions.push(this.createScalar(`Bool`))
        this.documentAst.definitions.push(this.createScalar(`Bytes`))
        this.documentAst.definitions.push(this.createScalar(`Empty`))
        this.documentAst.definitions.push(this.createScalar(`Error`))
        this.documentAst.definitions.push(this.createScalar(`Json`))
        this.documentAst.definitions.push(this.createScalar(`Timestamp`))
        this.documentAst.definitions.push(this.createScalar(`Date`))

        this.protos = {};
        this.collection.classes.map(cls => this.collectCls(cls, collection));

        const querys: ast.FieldDefinitionAst[] = [];
        const mutations: ast.FieldDefinitionAst[] = [];
        const subscriptions: ast.FieldDefinitionAst[] = [];

        const protos: ast.TypeDefinitionAst[] = [];
        // const protos: ast.FieldDefinitionAst[] = [];
        node.contexts.map(ctx => {
            ctx.querys.forEach(query => {
                const entities = query.getEntities();
                if (entities.length > 0) {
                    entities.map(entity => {
                        query.currentEntity = entity;
                        this.tsToGraphqlVisitor.isEntity = false;
                        const ast = this.tsToGraphqlVisitor.visitMethodDeclaration(query.node as any, query);
                        if (ast) querys.push(ast)
                    });
                } else {
                    query.currentEntity = ``;
                    this.tsToGraphqlVisitor.isEntity = false;
                    const ast = this.tsToGraphqlVisitor.visitMethodDeclaration(query.node as any, query);
                    if (ast) {
                        const existIndex = querys.findIndex(q => q.name.value === ast.name.value)
                        if (existIndex > -1) {
                            querys.splice(existIndex, 1, ast)
                        } else {
                            querys.push(ast)
                        }
                    }
                }
            });
            ctx.mutations.forEach(query => {
                const entities = query.getEntities();
                if (entities.length > 0) {
                    entities.map(entity => {
                        query.currentEntity = entity;
                        this.tsToGraphqlVisitor.isEntity = false;
                        const ast = this.tsToGraphqlVisitor.visitMethodDeclaration(query.node as any, query)
                        if (ast) mutations.push(ast)
                    });
                } else {
                    query.currentEntity = ``;
                    this.tsToGraphqlVisitor.isEntity = false;
                    const ast = this.tsToGraphqlVisitor.visitMethodDeclaration(query.node as any, query);
                    if (ast) {
                        const existIndex = mutations.findIndex(q => q.name.value === ast.name.value)
                        if (existIndex > -1) {
                            mutations.splice(existIndex, 1, ast)
                        } else {
                            mutations.push(ast)
                        }
                    }
                }
            });
            ctx.subscriptions.forEach(query => {
                const entities = query.getEntities();
                if (entities.length > 0) {
                    entities.map(entity => {
                        query.currentEntity = entity;
                        this.tsToGraphqlVisitor.isEntity = false;
                        const ast = this.tsToGraphqlVisitor.visitMethodDeclaration(query.node as any, query)
                        if (ast) subscriptions.push(ast)
                    });
                } else {
                    query.currentEntity = ``;
                    this.tsToGraphqlVisitor.isEntity = false;
                    const ast = this.tsToGraphqlVisitor.visitMethodDeclaration(query.node as any, query)
                    if (ast) {
                        const existIndex = subscriptions.findIndex(q => q.name.value === ast.name.value)
                        if (existIndex > -1) {
                            subscriptions.splice(existIndex, 1, ast)
                        } else {
                            subscriptions.push(ast)
                        }
                    }
                }
            });
            ctx.protos.forEach(query => {
                const entities = query.getEntities();
                const params = query.params;
                let name = ctx.name;
                let method = query.name;
                if (typeof params === 'string') {
                    name = params;
                } else if (Array.isArray(params) && params.length >= 2) {
                    name = params[1];
                    method = params[2];
                }
                if (entities.length > 0) {
                    entities.map(entity => {
                        query.currentEntity = entity;
                        this.tsToGraphqlVisitor.isEntity = false;
                        const ast = this.tsToGraphqlVisitor.visitMethodDeclaration(query.node as any, query);
                        if (this.protos[name] && ast) {
                            this.protos[name].push(ast)
                        } else {
                            if (ast) this.protos[name] = [ast];
                        }
                        if (ast) protos.push(ast)
                    });
                } else {
                    query.currentEntity = ``;
                    this.tsToGraphqlVisitor.isEntity = false;
                    const ast = this.tsToGraphqlVisitor.visitMethodDeclaration(query.node as any, query)
                    if (this.protos[name] && ast) {
                        this.protos[name].push(ast)
                    } else {
                        if (ast) this.protos[name] = [ast];
                    }
                }
            });
        });
        const queryRes = this.createObjectTypeDefinitionAst('Query', querys);
        const mutationRes = this.createObjectTypeDefinitionAst('Mutation', mutations);
        const subscriptionRes = this.createObjectTypeDefinitionAst('Subscription', subscriptions);
        Object.keys(this.protos).map(key => {
            const protos = this.protos[key]
            const protoRes = this.createObjectTypeDefinitionAst(key, protos);
            protoRes.isProto = true;
            if (protoRes.fields.length > 0) {
                this.documentAst.definitions.push(protoRes)
            }
        });
        if (queryRes.fields.length > 0) {
            this.documentAst.definitions.push(queryRes)
        }
        if (mutationRes.fields.length > 0) {
            this.documentAst.definitions.push(mutationRes)
        }
        if (subscriptionRes.fields.length > 0) {
            this.documentAst.definitions.push(subscriptionRes)
        }
        this.documentAst.protos = this.getProtos();
        this.tsToGraphqlVisitor.sourceFile.statements.push(
            this.tsToGraphqlVisitor.query,
            this.tsToGraphqlVisitor.mutation,
            this.tsToGraphqlVisitor.subscription,
            ...this.tsToGraphqlVisitor.protos,
        );
        this.sourceFile = this.tsToGraphqlVisitor.sourceFile;
        return this.documentAst;
    }
    collectCls(node: ts.ClassDeclaration, context: CollectionContext) {
        const scalar = node.getDecorator<ScalarOptions>(`Scalar`)(expressionVisitor);
        const directive = node.getDecorator<DirectiveOptions>(`Directive`)(expressionVisitor);
        const injectable = node.getDecorator<InjectableOptions>(`Injectable`)(expressionVisitor);
        const module = node.getDecorator<ModuleOptions>(`Module`)(expressionVisitor);
        const resolver = node.getDecorator<string>(`Resolver`)(expressionVisitor);
        if (scalar !== null) {
            const scalarDef = new ast.ScalarTypeDefinitionAst();
            const context = new MagnusContext();
            scalarDef.name = this.tsToGraphqlVisitor.visitIdentifier(node.name, context);
            if (this.documentAst) {
                if (!this.documentAst.hasDefinitionAst(scalarDef.name.value)) {
                    this.documentAst.definitions.push(scalarDef)
                }
            }
            return scalarDef;
        }
        if (resolver !== null) {
            if (resolver) {
                const ctx = new MagnusContext();
                ctx.currentName = resolver;
                ctx.name = resolver;
                const type = this.tsToGraphqlVisitor.visitClassDeclaration(node, ctx);
                if (this.documentAst && type) {
                    const index = this.documentAst.getDefinitionAstIndex(type.name.value)
                    if (index > -1) {
                        this.documentAst.definitions.push(type)
                    } else {
                        this.documentAst.definitions.splice(index, 1, type)
                    }
                }
                return type;
            }
        }
    }
    createObjectTypeDefinitionAst(name: string, fields: ast.FieldDefinitionAst[]) {
        const node = parse.visitObjectTypeDefinitionAst(new ast.ObjectTypeDefinitionAst(), {
            kind: 'ObjectTypeDefinition',
            name: {
                kind: 'Name',
                value: name
            }
        });
        node.fields = fields || [];
        return node;
    }
}
