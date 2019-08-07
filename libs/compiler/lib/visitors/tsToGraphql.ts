import * as ast from './visitor';
import * as _ast from './visitor';
import { MagnusContext, MagnusTopContext } from './magnus'
import { ast as graphql, ToString } from '@notadd/magnus-graphql';
import { DirectiveOptions, PermissionOptions, HandlerDef } from '@notadd/magnus-core';
import { expressionVisitor } from './expression';
import { CollectionContext } from './collection';
export const toString = new ToString();
export const WhereMap: { [key: string]: string } = {
    Not: `不等于`,
    In: `在制定内，如[1,2]`,
    NotIn: `不在制定内,如[1,2]`,
    Lt: `小于`,
    Lte: `小于等于`,
    Gt: `大于`,
    Gte: `大于等于`,
    Contains: `包含`,
    NotContains: `不包含`,
    StartsWith: `开头等于`,
    NotStartsWith: `开头不等于`,
    EndsWith: `结尾等于`,
    NotEndsWith: `结尾不等于`
}
export class Handler {
    private __partial: Set<string> = new Set();
    private __order: Set<string> = new Set();
    private __where: Set<string> = new Set();

    constructor(public visitor: TsToGraphqlVisitor) { }
    Promise(node: ast.TypeReferenceNode | ast.TypeAliasDeclaration, context: any) {
        if (node instanceof ast.TypeReferenceNode) {
            if (node.typeArguments.length === 1) {
                const typeNode = node.typeArguments[0]
                return this.visitor.visitTypeNode(typeNode, context)
            }
        }
    }
    Observable(node: ast.TypeReferenceNode | ast.TypeAliasDeclaration, context: any) {
        if (node instanceof ast.TypeReferenceNode) {
            if (node.typeArguments.length === 1) {
                const typeNode = node.typeArguments[0]
                return this.visitor.visitTypeNode(typeNode, context)
            }
        }
    }
    Order(node: ast.TypeReferenceNode | ast.TypeAliasDeclaration, context: any) {
        if (node instanceof ast.TypeReferenceNode) {
            if (node.typeArguments.length === 1) {
                const source = node.typeArguments[0];
                let name = (source as any).typeName.text;
                if (!context.isEntity) {
                    const sourceRes = this.visitor.visitTypeNode(source, context);
                    if (sourceRes && (sourceRes as any).name) name = (sourceRes as any).name.value;
                }
                if (name) {
                    const sourceAst = this.visitor.collection.findByName(name);
                    if (sourceAst) {
                        const res = (sourceAst.visit(this.visitor, context) as graphql.ObjectTypeDefinitionAst);
                        if (res) {
                            res.fields = res.fields.map(field => {
                                const description = this.visitor.createStringValue([`排序可选值为ASC或者DESC`])
                                if (field.description && description) field.description.value += `\n${description.value}`
                                field.type = this.visitor.createNamedTypeAst('String')
                                return field;
                            });
                            const astName = res.name.value + 'Order';
                            if (this.__order.has(astName)) {
                                return this.visitor.createNamedTypeAst(astName);;
                            }
                            res.name.value = astName;
                            this.visitor.documentAst.definitions.push(res);
                            this.__order.add(astName);
                            return this.visitor.createNamedTypeAst(astName);
                        }
                    } else {
                        const item = this.visitor.documentAst.hasDefinitionAst(name) as graphql.ObjectTypeDefinitionAst;
                        if (item) {
                            const res = item.copy();
                            const astName = res.name.value + 'Order';
                            res.fields = res.fields || [];
                            res.fields = res.fields.map(field => {
                                const description = this.visitor.createStringValue([`排序可选值为ASC或者DESC`])
                                if (field.description && description) field.description.value += `\n${description.value}`
                                field.type = this.visitor.createNamedTypeAst('String')
                                return field;
                            });
                            if (this.__order.has(astName)) {
                                return this.visitor.createNamedTypeAst(astName);;
                            }
                            res.name.value = astName;
                            this.visitor.documentAst.definitions.push(res);
                            this.__order.add(astName);
                            return this.visitor.createNamedTypeAst(astName);
                        }
                    }
                }
            }
        }
    }
    DeepPartial(node: ast.TypeReferenceNode | ast.TypeAliasDeclaration, context: any) {
        if (node instanceof ast.TypeReferenceNode) {
            if (node.typeArguments.length === 1) {
                const source = node.typeArguments[0];
                const sourceRes = this.visitor.visitTypeNode(source, context);
                if (sourceRes instanceof graphql.NamedTypeAst) {
                    const sourceAst = this.visitor.collection.findByName(context.currentEntity);
                    if (sourceAst) {
                        const res = (sourceAst.visit(this.visitor, context) as graphql.ObjectTypeDefinitionAst);
                        res.fields = res.fields.map(field => {
                            if (field.type instanceof graphql.NonNullTypeAst) {
                                field.type = field.type.type
                            }
                            return field;
                        });
                        const astName = res.name.value + 'DeepPartial';
                        if (this.__partial.has(astName)) {
                            return this.visitor.createNamedTypeAst(astName);;
                        }
                        res.name.value = astName;
                        this.visitor.documentAst.definitions.push(res);
                        this.__partial.add(astName);
                        return this.visitor.createNamedTypeAst(astName);
                    }
                }
            }
        }
    }
    Partial(node: ast.TypeReferenceNode | ast.TypeAliasDeclaration, context: any) {
        if (node instanceof ast.TypeReferenceNode) {
            if (node.typeArguments.length === 1) {
                const source = node.typeArguments[0];
                const sourceRes = this.visitor.visitTypeNode(source, context);
                // debugger;
                if (sourceRes instanceof graphql.NamedTypeAst) {
                    const sourceAst = this.visitor.collection.findByName(context.currentEntity);
                    if (sourceAst) {
                        const res = (sourceAst.visit(this.visitor, context) as graphql.ObjectTypeDefinitionAst);
                        res.fields = res.fields.map(field => {
                            if (field.type instanceof graphql.NonNullTypeAst) {
                                field.type = field.type.type
                            }
                            return field;
                        });
                        const astName = res.name.value + 'Partial';
                        const old = this.visitor.documentAst.hasDefinitionAst(astName);
                        if (!old) {
                            res.name.value = astName;
                            this.visitor.documentAst.definitions.push(res);
                        }
                        return this.visitor.createNamedTypeAst(astName);
                    }
                }
            }
        }
    }
    Where(node: ast.TypeReferenceNode | ast.TypeAliasDeclaration, context: any) {
        if (node instanceof ast.TypeReferenceNode) {
            if (node.typeArguments.length === 1) {
                const source = node.typeArguments[0];
                let name = (source as any).typeName.text;
                if (!context.isEntity) {
                    const sourceRes = this.visitor.visitTypeNode(source, context);
                    if (sourceRes) {
                        if ((sourceRes as any).name) {
                            name = (sourceRes as any).name.value;
                        }
                    }
                }
                if (name) {
                    const sourceAst = this.visitor.collection.findByName(name);
                    if (sourceAst) {
                        const res = (sourceAst.visit(this.visitor, context) as graphql.ObjectTypeDefinitionAst);
                        const fields: any[] = [];
                        if (res) {
                            const astName = res.name.value + 'Where';
                            if (this.__where.has(astName)) {
                                return this.visitor.createNamedTypeAst(astName);;
                            }
                            const createField = (name: string) => {
                                const ast = new graphql.FieldDefinitionAst()
                                ast.name = this.visitor.createNameAst(name);
                                ast.type = this.visitor.createListTypeAst(
                                    this.visitor.createNonNullTypeAst(
                                        this.visitor.createNamedTypeAst(astName)
                                    )
                                );
                                return ast
                            }
                            res.fields.map(field => {
                                let needField = false;
                                let type = field.type;
                                if (type instanceof graphql.ListTypeAst) {
                                    return;
                                } else if (type instanceof graphql.NonNullTypeAst) {
                                    if (type.type instanceof graphql.ListTypeAst) {
                                        return;
                                    }
                                    type = type.type;
                                }
                                Object.keys(WhereMap).map((key: string) => {
                                    const typeName = (type as any).name.value;
                                    if (['Int', "String", "Boolean"].includes(typeName)) {
                                        const newField = field.copy();
                                        const desc1 = this.visitor.createStringValue([`${WhereMap[key]}`]);
                                        newField.description = newField.description || this.visitor.createStringValue([``]);
                                        if (field.description && desc1) newField.description.value = field.description.value + ` ${desc1.value}`;
                                        if (newField.name) newField.name.value = `${newField.name.value}_${key}`;
                                        if (['In', 'NotIn'].includes(key)) {
                                            if (typeName === 'Int' || typeName === 'String') {
                                                newField.type = this.visitor.createListTypeAst(
                                                    this.visitor.createNonNullTypeAst(field.type)
                                                );
                                                fields.push(newField);
                                                needField = true;
                                            }
                                        } else if (['Not', 'Lt', 'Lte', 'Gt', 'Gte'].includes(key)) {
                                            if (typeName === 'Int' || typeName === 'String') {
                                                newField.type = type;
                                                fields.push(newField);
                                                needField = true;
                                            }
                                        } else if (['Contains', 'NotContains', 'StartsWith', 'NotStartsWith', 'EndsWith', 'NotEndsWith'].includes(key)) {
                                            if (typeName === 'String') {
                                                newField.type = type;
                                                fields.push(newField);
                                                needField = true;
                                            }
                                        } else {

                                        }
                                    }
                                })
                                if (needField) {
                                    field.type = type;
                                    fields.push(field);
                                }
                            });
                            fields.push(createField(`AND`))
                            fields.push(createField(`OR`))
                            fields.push(createField(`NOT`))
                            res.fields = fields;
                            res.name.value = astName;
                            this.visitor.documentAst.definitions.push(res);
                            this.__where.add(astName);
                            return this.visitor.createNamedTypeAst(astName);
                        }
                    } else {
                        const item = this.visitor.documentAst.hasDefinitionAst(name) as graphql.ObjectTypeDefinitionAst;
                        if (item) {
                            const res = item.copy();
                            const fields: any[] = [];
                            const astName = res.name.value + 'Where';
                            if (this.__where.has(astName)) {
                                return this.visitor.createNamedTypeAst(astName);;
                            }
                            const createField = (name: string) => {
                                const ast = new graphql.FieldDefinitionAst()
                                ast.name = this.visitor.createNameAst(name);
                                ast.type = this.visitor.createListTypeAst(
                                    this.visitor.createNonNullTypeAst(
                                        this.visitor.createNamedTypeAst(astName)
                                    )
                                );
                                return ast
                            }
                            res.fields.map(field => {
                                let needField = false;
                                let type = field.type;
                                if (type instanceof graphql.ListTypeAst) {
                                    return;
                                } else if (type instanceof graphql.NonNullTypeAst) {
                                    if (type.type instanceof graphql.ListTypeAst) {
                                        return;
                                    }
                                    type = type.type;
                                }
                                Object.keys(WhereMap).map((key: string) => {
                                    const typeName = (type as any).name.value;
                                    if (['Int', "String", "Boolean", "Timestamp", "Date"].includes(typeName)) {
                                        const newField = field.copy();
                                        const desc1 = this.visitor.createStringValue([`${WhereMap[key]}`]);
                                        newField.description = newField.description || this.visitor.createStringValue([``]);
                                        if (field.description && desc1) newField.description.value = field.description.value + ` ${desc1.value}`;
                                        if (newField.name) newField.name.value = `${newField.name.value}_${key}`;
                                        if (['In', 'NotIn'].includes(key)) {
                                            if (typeName === 'Int' || typeName === 'String') {
                                                newField.type = this.visitor.createListTypeAst(
                                                    this.visitor.createNonNullTypeAst(field.type)
                                                );
                                                fields.push(newField);
                                                needField = true;
                                            }
                                        } else if (['Not', 'Lt', 'Lte', 'Gt', 'Gte'].includes(key)) {
                                            if (typeName === 'Int' || typeName === 'String' || typeName === 'Timestamp' || typeName === 'Date') {
                                                newField.type = type;
                                                fields.push(newField);
                                                needField = true;
                                            }
                                        } else if (['Contains', 'NotContains', 'StartsWith', 'NotStartsWith', 'EndsWith', 'NotEndsWith'].includes(key)) {
                                            if (typeName === 'String') {
                                                newField.type = type;
                                                fields.push(newField);
                                                needField = true;
                                            }
                                        } else {

                                        }
                                    }
                                })
                                if (needField) {
                                    field.type = type;
                                    fields.push(field);
                                }
                            });
                            fields.push(createField(`AND`))
                            fields.push(createField(`OR`))
                            fields.push(createField(`NOT`))
                            res.fields = fields;
                            res.name.value = astName;
                            this.visitor.documentAst.definitions.push(res);
                            this.__where.add(astName);
                            return this.visitor.createNamedTypeAst(astName);
                        }
                    }
                }
            }
        }
    }
}
// 防止循环依赖
export class TsToGraphqlVisitor implements ast.Visitor {
    name: string = `TsToGraphqlVisitor`;
    documentAst: graphql.DocumentAst;
    collection: CollectionContext;
    /**
     * 定义文件
     */
    def: { [key: string]: HandlerDef[] } = {};
    query: ast.InterfaceDeclaration = new ast.InterfaceDeclaration();
    mutation: ast.InterfaceDeclaration = new ast.InterfaceDeclaration();
    subscription: ast.InterfaceDeclaration = new ast.InterfaceDeclaration();
    // protos
    protos: ast.InterfaceDeclaration[] = [];
    sourceFile: ast.SourceFile = new ast.SourceFile();
    /**
     * 权限搜集
     */
    permission: PermissionOptions[] = [];
    // entity
    isEntity: boolean = false;
    entities: { [key: string]: { name: string, relation: string, entity: string }[] } = {};
    handler: Handler;
    constructor() {
        this.handler = new Handler(this);
        this.sourceFile.statements = [];
        this.query.name = this.createIdentifier(`Query`);
        this.mutation.name = this.createIdentifier(`Mutation`);
        this.subscription.name = this.createIdentifier(`Subscription`);
    }
    createIdentifier(text: string) {
        const iden = new ast.Identifier();
        iden.text = text;
        return iden;
    }
    isUndefined(val: any) {
        return typeof val === 'undefined';
    }
    visitClassDeclaration(node: ast.ClassDeclaration, context: MagnusContext): graphql.InterfaceTypeDefinitionAst | graphql.InputObjectTypeDefinitionAst | graphql.ScalarTypeDefinitionAst | undefined {
        const top = new MagnusTopContext();
        top.name = node.name.visit(expressionVisitor, ``);
        context = context || new MagnusContext();
        context.parent = context.parent || top;
        const scalar = node.getDecorator(`Scalar`)(expressionVisitor);
        const directive = node.getDecorator<DirectiveOptions>(`Directive`)(expressionVisitor);
        const injectable = node.getDecorator(`Injectable`)(expressionVisitor);
        const module = node.getDecorator(`Module`)(expressionVisitor);
        /**
         * 添加resolver中的ResolveProperty，并添加到制定的interface中
         */
        const resolver = node.getDecorator(`Resolver`)(expressionVisitor);
        // 搜集Entity
        const entity = node.getDecorator(`Entity`)(expressionVisitor);
        this.isEntity = false;
        if (entity !== null) {
            // 搜集字段
            this.isEntity = true;
            const name = node.name.visit(expressionVisitor, ``);
            this.entities[name] = node.members.filter((member: any) => {
                const manyToOne = member.getDecorator(`ManyToOne`)(expressionVisitor);
                const oneToMany = member.getDecorator(`OneToMany`)(expressionVisitor);
                const oneToOne = member.getDecorator(`OneToOne`)(expressionVisitor);
                const manyToMany = member.getDecorator(`ManyToMany`)(expressionVisitor);
                const resolveProperty = member.getDecorator(`ResolveProperty`)(expressionVisitor);
                if (manyToOne !== null || oneToMany !== null || oneToOne !== null || manyToMany !== null || resolveProperty !== null) {
                    return true;
                }
                return false;
            }).map((member: any) => {
                const name = (member as ast.PropertyDeclaration).name.visit(expressionVisitor, ``)
                const manyToOne = member.getDecorator(`ManyToOne`)(expressionVisitor);
                const oneToMany = member.getDecorator(`OneToMany`)(expressionVisitor);
                const oneToOne = member.getDecorator(`OneToOne`)(expressionVisitor);
                const manyToMany = member.getDecorator(`ManyToMany`)(expressionVisitor);
                const resolveProperty = member.getDecorator(`ResolveProperty`)(expressionVisitor);
                const type = member.type.visit(expressionVisitor, ``);
                let entity = ``;
                if (typeof type === 'string') {
                    entity = type;
                } else {
                    entity = type.elementType;
                }
                let relation = ``;
                if (manyToOne !== null) {
                    relation = `ManyToOne`;
                } else if (oneToMany !== null) {
                    relation = `OneToMany`;
                } else if (oneToOne !== null) {
                    relation = `OneToOne`;
                } else if (manyToMany !== null) {
                    relation = `ManyToMany`;
                } else if (resolveProperty !== null) {
                    relation = `ResolveProperty`;
                }
                return {
                    name,
                    relation,
                    entity
                }
            });
        }
        if (context.isInput) {
            // debugger;
        }
        const members = node.members.filter(member => {
            return !(member instanceof ast.MethodDeclaration) || member.getDecorator(`ResolveProperty`)(expressionVisitor) !== null;
        }).map((member) => {
            (member as any).questionToken = true;
            return member;
        });
        if (resolver && typeof resolver === 'string') {
            const resolverCls = this.collection.findByName(resolver);
            const members = node.members.filter(member => member instanceof ast.MethodDeclaration) as ast.MethodDeclaration[];
            if (resolverCls instanceof ast.InterfaceDeclaration) {
                const interfaceMembers = members.map((member: ast.MethodDeclaration) => {
                    const isResolveProperty = member.getDecorator(`ResolveProperty`)(expressionVisitor)
                    if (isResolveProperty !== null) {
                        const node = new ast.MethodSignature();
                        node.name = new ast.Identifier();
                        node.name.text = member.name.visit(expressionVisitor, ``);
                        node.type = member.type;
                        node.docs = member.docs;
                        node.questionToken = new ast.QuestionToken();
                        return node;
                    }
                }).filter(node => !!node) as ast.MethodSignature[];
                resolverCls.members.push(...interfaceMembers);
                return resolverCls.visit(this, context);
            } else if (resolverCls instanceof ast.ClassDeclaration) {
                const interfaceMembers = members.map((member: ast.MethodDeclaration) => {
                    const isResolveProperty = member.getDecorator(`ResolveProperty`)(expressionVisitor)
                    if (isResolveProperty !== null) return member;
                }).filter(node => !!node) as ast.MethodDeclaration[];
                resolverCls.members.push(...interfaceMembers);
                const res = resolverCls.visit(this, context);
                return res;
            }
            return;
        }
        if (scalar !== null) {
            const ast = new graphql.ScalarTypeDefinitionAst();
            ast.name = node.name.visit(this, context);
            ast.directives = [];
            const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
            if (description) ast.description = description;
            return ast;
        }
        if (directive !== null) {
            // 记录
            return;
        }
        if (context.isInput) {
            const ast = new graphql.InputObjectTypeDefinitionAst();
            const ctx = context || new MagnusContext();
            // ctx.contextParent = context;
            ctx.isUpperFirst = true;
            ctx.isInput = true;
            ast.name = node.name.visit(this, ctx);
            ast.fields = members.map(member => member.visit(this, ctx)).filter(item => !!item);
            const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
            if (description) ast.description = description;
            if (ast.fields.length > 0) return ast;
        }
        const _ast = new graphql.ObjectTypeDefinitionAst();
        const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
        if (description) _ast.description = description;
        const ctx = context || new MagnusContext();
        // ctx.contextParent = context;
        ctx.isUpperFirst = true;
        // ctx.isInput = false;
        _ast.name = node.name.visit(this, ctx);
        _ast.fields = members.map(member => member.visit(this, ctx)).filter(item => !!item);
        if (_ast.fields.length > 0) return _ast as any;
    }
    visitMethodSignature(node: ast.MethodSignature, context: MagnusContext): graphql.FieldDefinitionAst | undefined {
        context.isProperty = false;
        context.oldName = node.name.visit(expressionVisitor, ``)
        node.type.visit(this, context)
        if (context.isInput) {
            // 完善信息
            return undefined;
        }
        const res = new graphql.FieldDefinitionAst();
        const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
        if (description) res.description = description;
        context.isInput = true;
        const args = node.parameters.filter(par => {
            const isParent = par.getDecorator('Parent')(expressionVisitor);
            const isSelection = par.getDecorator('Selection')(expressionVisitor);
            const isRelation = par.getDecorator('Relation')(expressionVisitor);
            if (isParent !== null) return false;
            if (isRelation !== null) return false;
            if (isSelection !== null) return false;
            return true;
        });
        res.arguments = args.map(par => this.visitParameterDeclaration(par, context));
        context.isInput = false;
        const type = this.visitTypeNode(node.type, context)
        if (type) res.type = this.createNonNullTypeAst(type);
        res.name = this.visitPropertyName(node.name, context);
        return res;
    }
    visitPropertySignature(node: ast.PropertySignature, context: MagnusContext) {
        context._needChangeName = false;
        context.isUpperFirst = false;
        context.isProperty = false;
        context.name = node.name.visit(expressionVisitor, ``)
        if (context.isInput) {
            const res = new graphql.InputValueDefinitionAst()
            const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
            if (description) res.description = description;
            if (node.questionToken) {
                const type = this.visitTypeNode(node.type, context)
                if (type) res.type = type;
            } else {
                const type = this.visitTypeNode(node.type, context)
                if (type) res.type = this.createNonNullTypeAst(type);
            }
            context.currentName = node.name.visit(expressionVisitor, ``);
            res.name = this.visitPropertyName(node.name, context);
            return res;
        } else {
            const res = new graphql.FieldDefinitionAst()
            const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
            if (description) res.description = description;
            if (node.questionToken) {
                const type = this.visitTypeNode(node.type, context)
                if (type) res.type = type;
            } else {
                const type = this.visitTypeNode(node.type, context)
                if (type) res.type = this.createNonNullTypeAst(type);
            }
            context.currentName = node.name.visit(expressionVisitor, ``);
            res.name = this.visitPropertyName(node.name, context);
            return res;
        }
    }
    visitPropertyDeclaration(node: ast.PropertyDeclaration, context: MagnusContext) {
        /**
         * 初始化
         */
        context.isProperty = false;
        context._needChangeName = false;
        context.isUpperFirst = false;
        // context.name = node.name.visit(expressionVisitor, context);
        const name = node.name.visit(expressionVisitor, ``);
        const modifiers = node.modifiers.map(mod => mod.visit(this, context));
        const res = new graphql.FieldDefinitionAst()
        const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
        if (description) res.description = description;
        const type = this.visitTypeNode(node.type, context)
        if (node.questionToken) {
            if (type) res.type = type;
        } else {
            if (this.isNotRequired(node)) {
                if (type) res.type = type;
            } else {
                if (type) res.type = this.createNonNullTypeAst(type);
            }
        }
        context.currentName = node.name.visit(expressionVisitor, context);
        res.name = this.visitPropertyName(node.name, context);
        return res;
    }
    /**
     * 是否非必填项目
     */
    isNotRequired(node: ast.PropertyDeclaration) {
        if (node.getDecorator('CreateDateColumn')(expressionVisitor) !== null) return true;
        if (node.getDecorator('UpdateDateColumn')(expressionVisitor) !== null) return true;
        if (node.getDecorator('PrimaryGeneratedColumn')(expressionVisitor) !== null) return true;
        if (node.getDecorator('ManyToOne')(expressionVisitor) !== null) return true;
        if (node.getDecorator('OneToMany')(expressionVisitor) !== null) return true;
        if (node.getDecorator('ManyToMany')(expressionVisitor) !== null) return true;
        if (node.getDecorator('OneToOne')(expressionVisitor) !== null) return true;
        const column: any = node.getDecorator('Column')(expressionVisitor);
        if (column !== null) {
            if (column && !!column.default) return true;
        }
        return false;
    }
    createMethodSignature(node: ast.MethodDeclaration) {
        const method = new ast.MethodSignature();
        method.name = node.name;
        method.type = node.type;
        method.questionToken = node.questionToken;
        method.parameters = node.parameters;
        method.typeParameters = node.typeParameters;

        return method;
    }
    createPropertySignature(node: ast.PropertyDeclaration) {
        const property = new ast.PropertySignature();
        property.name = node.name;
        property.type = node.type;
        property.questionToken = node.questionToken;
        return property;
    }
    createMetadate(res: any, context: any, node: any): HandlerDef {
        return [res.name.value, context.topName, context.currentEntity, node.name.visit(expressionVisitor, ``), res.allArguments.map((arg: any) => {
            const name = arg.name.visit(toString, ``);
            const type = arg.type.visit(toString, ``);
            const res = {
                name, type,
                index: arg.index,
                decorator: arg.decorator
            }
            return res;
        })];
    }
    visitMethodDeclaration(node: ast.MethodDeclaration, context: MagnusContext): graphql.FieldDefinitionAst | undefined {
        context.isProperty = false;
        if (context.isInput) {
            // 完善信息
            return undefined;
        }
        const proto = node.getDecorator<string>(`GrpcMethod`)(expressionVisitor);
        const permission = node.getDecorator<PermissionOptions>(`Permission`)(expressionVisitor);
        const ResolveProperty = node.getDecorator(`ResolveProperty`)(expressionVisitor)
        if (permission !== null) {
            if (proto !== null && permission) {
                if (typeof proto === 'string') {
                    if (permission) {
                        permission.namespace = proto;
                        this.permission.push(permission);
                    }
                } else {
                    permission.namespace = context.parentName;
                    this.permission.push(permission);
                }
            } else {
                if (permission) {
                    permission.namespace = context.parentName;
                    this.permission.push(permission);
                }
            }
        }
        // 判断return type是否包含 parameter
        node.type && node.type.visit(this, context);
        // 完善信息
        const res = new graphql.FieldDefinitionAst();
        // 是否需要改名字
        const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
        if (description) res.description = description;
        context.isInput = true;
        const args = node.parameters.filter(par => {
            const isParent = par.getDecorator('Parent')(expressionVisitor);
            const isSelection = par.getDecorator('Selection')(expressionVisitor);
            const isRelation = par.getDecorator('Relation')(expressionVisitor);
            if (isParent !== null) return false;
            if (isRelation !== null) return false;
            if (isSelection !== null) return false;
            return true;
        });
        res.arguments = args.map(par => this.visitParameterDeclaration(par, context));
        res.allArguments = node.parameters.map(par => this.visitParameterDeclaration(par, context));
        context.isInput = false;
        // 返回值
        context.isNonNull = false;
        const type = this.visitTypeNode(node.type, context);
        if (type) res.type = type;
        if (context.currentEntity.length > 0) {
            if (ResolveProperty === null) {
                context._needChangeName = true;
                context.currentName = `${node.name.visit(expressionVisitor, ``)}${context.currentEntity}`;
            }
        } else {
            context._needChangeName = false;
        }
        res.name = this.visitPropertyName(node.name, context);
        if (ResolveProperty !== null) {
            this.def[context.topName] = this.def[context.topName] || [];
            const ctx = new MagnusContext();
            ctx.parent = context.parent;
            ctx.currentEntity = context.topName;
            const item = this.createMetadate(res, ctx, node);
            this.def[context.topName].push(item)
            return res;
        }
        if (context.isQuery) {
            this.def.query = this.def.query || [];
            const item = this.createMetadate(res, context, node)
            if (context.currentEntity) {
                this.def.query.push(item);
                this.query.members.push(this.createMethodSignature(node))
            } else {
                const existIndex = this.def.query.findIndex(it => it[0] === item[0])
                if (existIndex > -1) {
                    this.def.query.splice(existIndex, 1, item)
                    this.query.members.splice(existIndex, 1, this.createMethodSignature(node))
                } else {
                    this.def.query.push(item);
                    this.query.members.push(this.createMethodSignature(node))
                }
            }
        }
        else if (context.isMutation) {
            this.def.mutation = this.def.mutation || [];
            const item = this.createMetadate(res, context, node)
            if (context.currentEntity) {
                this.def.mutation.push(item);
                this.mutation.members.push(this.createMethodSignature(node))
            } else {
                const existIndex = this.def.mutation.findIndex(it => it[0] === item[0])
                if (existIndex > -1) {
                    this.def.mutation.splice(existIndex, 1, item)
                    this.mutation.members.splice(existIndex, 1, this.createMethodSignature(node))
                } else {
                    this.def.mutation.push(item);
                    this.mutation.members.push(this.createMethodSignature(node))
                }
            }
        }
        else if (context.isSubscription) {
            this.def.subscription = this.def.subscription || [];
            const item = this.createMetadate(res, context, node)
            if (context.currentEntity) {
                this.def.subscription.push(item);
                this.subscription.members.push(this.createMethodSignature(node))
            } else {
                const existIndex = this.def.subscription.findIndex(it => it[0] === item[0])
                if (existIndex > -1) {
                    this.def.subscription.splice(existIndex, 1, item)
                    this.subscription.members.splice(existIndex, 1, this.createMethodSignature(node))
                } else {
                    this.def.subscription.push(item);
                    this.subscription.members.push(this.createMethodSignature(node))
                }
            }
        }
        else if (context.isProto) {
            let proto = this.protos.find(proto => proto.name.visit(expressionVisitor, ``) === context.params);
            if (!proto) {
                proto = new ast.InterfaceDeclaration();
                proto.name = this.createIdentifier(context.params);
                this.protos.push(proto)
            }
            proto.members.push(this.createMethodSignature(node))
        }
        return res;
    }
    visitJSDoc(node: ast.JSDoc, context: MagnusContext): string {
        return node.comment;
    }
    visitTypeNode(node: ast.TypeNode, context: MagnusContext): graphql.TypeAst {
        if (node instanceof ast.ArrayTypeNode) {
            return this.visitArrayTypeNode(node, context)
        } else if (node instanceof ast.KeywordTypeNode) {
            return this.visitKeywordTypeNode(node, context)
        } else if (node instanceof ast.TypeReferenceNode) {
            return this.visitTypeReferenceNode(node, context)
        } else if (node instanceof ast.UnionTypeNode) {
            return this.visitUnionTypeNode(node, context)
        } else {
            return this.createNamedTypeAst('Empty')
        }
    }
    set: Set<string> = new Set()
    addType(name: string, context: MagnusContext): any {
        /**
         * 如果操作的是自身 那么放弃
         */
        if (!context) {
            return;
        }
        if (context.parentName === name) {
            return;
        }
        if (this.documentAst) {
            const ast3 = this.documentAst.hasDefinitionAst(context.currentName);
            if (ast3) {
                if (context.isInput) {
                    if (ast3 instanceof graphql.InputObjectTypeDefinitionAst) {
                        return;
                    } else {
                        context.currentName = context.currentName + `Input`;
                        context.isInput = true;
                        return this.addType(name, context);
                    }
                }
            }
            // const namedAst = this.documentAst.hasDefinitionAst(context.currentName);
            if (context.isInput) {
                if (!context.currentName.endsWith('Input')) {
                    context.currentName = `${context.currentName}Input`
                }
            }
            if (this.set.has(context.currentName)) {
                return;
            }
            const ast2 = this.collection.findByName(name);
            if (ast2) {
                // 需要处理循环依赖
                const oldName = context.currentName;
                this.set.add(context.currentName);
                const graphAst = ast2.visit(this, context);
                context.currentName = oldName;
                if (!this.documentAst.hasDefinitionAst(context.currentName)) {
                    this.documentAst.definitions.push(graphAst)
                }
            } else {
                context.currentName = name;
            }
        }
    }
    visitTypeReferenceNode(node: ast.TypeReferenceNode, context: MagnusContext): graphql.TypeAst {
        const typeName = expressionVisitor.visitTypeReferenceNode(node, ``);
        const typeArguments = node.typeArguments.map(t => t.visit(expressionVisitor, ``))
        const handler = (this.handler as any)[typeName];
        if (handler) {
            const res = handler.bind(this.handler)(node, context);
            if (res) return res;
        }
        const ctx = new MagnusContext();
        ctx.contextParent = context;
        ctx.isInput = context.isInput;
        ctx.currentEntity = context.currentEntity;
        ctx.currentName = typeName;
        /**
         * 如果有
         */
        if (context.hasTypeParameter(typeName)) {
            // 添加一个type
            ctx.currentName = context.currentEntity;
            context._needChangeName = true;
            context.currentName = ctx.currentName;
            this.addType(ctx.currentEntity, ctx)
            return this.createNamedTypeAst(ctx.currentName);
        }
        if (typeArguments.length > 0) {
            const name = typeArguments.map(it => {
                if (context.hasTypeParameter(it)) {
                    return context.currentEntity;
                } else {
                    context.currentEntity = it;
                }
                return it;
            }).reverse().join('');
            // 添加一个 type
            ctx.currentName = `${name}${typeName}`;
            context.currentName = ctx.currentName;
            this.addType(typeName, ctx);
            return this.createNamedTypeAst(ctx.currentName)
        }
        // 需要补充的
        // context.currentName = ctx.currentName;
        this.addType(`${typeName}`, ctx);
        return this.createNamedTypeAst(ctx.currentName)
    }

    visitInterfaceDeclaration(node: ast.InterfaceDeclaration, context: MagnusContext) {
        context.isProperty = true;
        context.isUpperFirst = true;
        node.typeParameters.map(type => context.typeParameters.add(type.visit(expressionVisitor, ``)));
        if (context.isInput) {
            const ast = new graphql.InputObjectTypeDefinitionAst();
            const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
            if (description) ast.description = description;
            ast.name = node.name.visit(this, context);
            context.isInput = true;
            ast.fields = node.members.map(member => member.visit(this, context)).filter(res => !!res)
            if (ast.fields.length > 0) return ast;
        } else {
            const ast = new graphql.ObjectTypeDefinitionAst();
            const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
            if (description) ast.description = description;
            ast.name = node.name.visit(this, context)
            ast.fields = node.members.map(member => member.visit(this, context))
            if (ast.fields.length > 0) return ast;
        }
    }
    createNamedTypeAst(name: string) {
        const res = new graphql.NamedTypeAst();
        res.name = this.createNameAst(name)
        return res;
    }
    createListTypeAst(type: any) {
        const res = new graphql.ListTypeAst()
        res.type = type;
        return res;
    }
    createNameAst(name: string) {
        const res = new graphql.NameAst();
        res.value = name;
        return res;
    }
    createStringValue(content: string[]) {
        if (content.length > 0) {
            const res = new graphql.StringValueAst();
            res.value = content.join(" ");
            return res;
        }
        return undefined;
    }
    visitKeywordTypeNode(node: ast.KeywordTypeNode, context: MagnusContext): graphql.TypeAst {
        switch (node.name) {
            case 'bigint':
                return this.createNamedTypeAst('Int');
            case 'boolean':
                return this.createNamedTypeAst('Boolean');
            case 'number':
                return this.createNamedTypeAst('Int');
            case 'string':
                return this.createNamedTypeAst('String');
            case 'null':
            case 'undefined':
                return this.createNamedTypeAst('Empty');
            case 'unknown':
            case 'any':
            case 'object':
                return this.createNamedTypeAst('Json');
            case 'symbol':
            case 'never':
            case 'this':
            case 'void':
            default:
                return this.createNamedTypeAst('Error');
        }
    }
    visitArrayTypeNode(node: ast.ArrayTypeNode, context: MagnusContext) {
        const res = new graphql.ListTypeAst();
        res.type = node.elementType.visit(this, context)
        return res;
    }
    visitPropertyName(node: ast.PropertyName, context: MagnusContext): graphql.NameAst {
        // todo
        const res = new graphql.NameAst();
        if (node instanceof ast.Identifier) {
            return this.visitIdentifier(node, context)
        }
        else if (node instanceof ast.StringLiteral) {
            res.value = this.visitStringLiteral(node, context)
        } else if (node instanceof ast.NumericLiteral) {
            res.value = this.visitNumericLiteral(node, context)
        } else if (node instanceof ast.ComputedPropertyName) {
            res.value = this.visitComputedPropertyName(node, context)
        }
        return res;
    }
    visitComputedPropertyName(node: ast.ComputedPropertyName, context: MagnusContext): any {
        return node.expression.visit(this, context)
    }
    visitNumericLiteral(node: ast.NumericLiteral, context: MagnusContext) {
        return node.text;
    }
    visitStringLiteral(node: ast.StringLiteral, context: MagnusContext) {
        return node.text;
    }
    visitIdentifier(node: ast.Identifier, context: MagnusContext) {
        if (context.needChangeName) {
            if (context.isProperty) {
                // 如果是属性
                const name = context.currentName || `${context.currentEntity}_${node.text}`;
                if (context.isUpperFirst) {
                    // return this.createNameAst(upperFirst(camelCase(name)))
                    return this.createNameAst(name)
                }
                // return this.createNameAst(camelCase(name))
                return this.createNameAst(name)
            } else {
                const name = context.currentName || `${node.text}_${context.currentEntity}`;
                if (context.isUpperFirst) {
                    // return this.createNameAst(upperFirst(camelCase(name)))
                    return this.createNameAst(name)
                }
                // return this.createNameAst(camelCase(name))
                return this.createNameAst(name)
            }
        }
        return this.createNameAst(`${node.text}`)
    }
    visitParameterDeclaration(node: ast.ParameterDeclaration, context: MagnusContext): graphql.InputValueDefinitionAst {
        context.isProperty = true;
        // 初始化
        const res = new graphql.InputValueDefinitionAst();
        const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
        if (description) res.description = description;
        // name过后初始化
        const type = this.visitTypeNode(node.type, context);
        const selection = node.getDecorator('Selection')(expressionVisitor);
        const parent = node.getDecorator('Parent')(expressionVisitor);
        const relation = node.getDecorator('Relation')(expressionVisitor);

        if (selection !== null) {
            res.decorator = `Selection`;
        }
        if (relation !== null) {
            res.decorator = `Relation`;
        }
        if (parent !== null) {
            res.decorator = `Parent`;
        }
        res.index = node.index;
        // const type = this.visitTypeNode(node.type, context);
        if (node.questionToken || !!node.initializer) {
            res.type = type
        } else {
            res.type = this.createNonNullTypeAst(type)
        }
        context._needChangeName = false;
        res.name = this.visitBindingName(node.name, context);
        return res;
    }
    visitBindingName(node: ast.BindingName, context: MagnusContext): graphql.NameAst {
        return node.visit(this, context)
    }
    createNonNullTypeAst(type: graphql.NamedTypeAst | graphql.ListTypeAst) {
        if (type instanceof graphql.NonNullTypeAst) {
            return type;
        }
        const node = new graphql.NonNullTypeAst();
        node.type = type;
        return node;
    }
    visitConstructorDeclaration(node: ast.ConstructorDeclaration, context: MagnusContext) {

    }
    visitTypeAliasDeclaration(node: ast.TypeAliasDeclaration, context: MagnusContext): any {
        const type = node.type.visit(this, context);
        if (type instanceof graphql.NamedTypeAst) {
            const handler = (this.handler as any)[type.name.value];
            if (handler) {
                const res = handler.bind(this.handler)(node, context);
                if (res) return res;
            }
        } else if (type instanceof graphql.UnionTypeDefinitionAst) {
            context._needChangeName = false;
            type.name = node.name.visit(this, context);
            return type;
        } else if (type instanceof graphql.EnumTypeDefinitionAst) {
            context._needChangeName = false;
            type.name = node.name.visit(this, context);
            return type;
        } else {
            debugger;
        }
        const scalar = new graphql.ScalarTypeDefinitionAst();
        const ctx = new MagnusContext();
        // ctx.contextParent = context;
        const name = node.name.visit(this, ctx);
        scalar.name = name;
        return scalar;
    }
    visitTypeLiteralNode(node: ast.TypeLiteralNode, context: any) {
        const enumType = new graphql.EnumTypeDefinitionAst();
        enumType.values = node.members.map(member => member.visit(this, context))
        return enumType;
    }
    visitTypeElement(node: ast.TypeElement, context: any): any {
        return node.visit(this, context)
    }
    visitUnionTypeNode(node: ast.UnionTypeNode, context: any): any {
        const types = node.types.filter(t => {
            if (t instanceof ast.KeywordTypeNode) {
                if (t.name === 'undefined' || t.name === 'null') {
                    context.isNonNull = true;
                    return false;
                }
            }
            return true;
        }).map(t => t.visit(this, context));
        if (types.length === 1) {
            return types[0];
        }
        const union = new graphql.UnionTypeDefinitionAst();
        union.types = node.types.map(t => t.visit(this, context));
        return union;
    }
    visitLiteralTypeNode(node: ast.LiteralTypeNode, context: any): any {
        return node.literal.visit(this, context)
    }
    visitModifier(node: ast.Modifier, context: any) { }
    visitEnumDeclaration(node: ast.EnumDeclaration, context: MagnusContext) {
        const enumNode = new graphql.EnumTypeDefinitionAst();
        const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
        if (description) enumNode.description = description;
        context.isUpperFirst = true;
        context.isInput = false;
        context._needChangeName = false;
        enumNode.name = node.name.visit(this, context);
        enumNode.values = node.members.map(member => {
            return member.visit(this, context);
        });
        return enumNode;
    }
    visitEnumMember(node: ast.EnumMember, context: MagnusContext) {
        const enumMember = new graphql.EnumValueDefinitionAst();
        const description = this.createStringValue(node.docs.map(doc => this.visitJSDoc(doc, context)));
        if (description) enumMember.description = description;
        context._needChangeName = false;
        enumMember.name = node.name.visit(this, context);
        return enumMember;
    }
}
