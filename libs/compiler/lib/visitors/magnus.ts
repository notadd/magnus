import * as ast from './visitor';
import { expressionVisitor } from './expression';
import { CollectionContext } from './collection';
export interface MagnusOptions {
    entities: string[];
}
export interface ClassDef {
    name: string;
    relations: string[];
}
export const entitySet: Set<string> = new Set();
export class MagnusTopContext {
    querys: Map<string, MagnusContext> = new Map();
    mutations: Map<string, MagnusContext> = new Map();
    subscriptions: Map<string, MagnusContext> = new Map();
    entityMap: Map<string, MagnusContext> = new Map();
    // proto
    protos: Map<string, MagnusContext> = new Map();

    typeParameters: Set<string> = new Set();
    entities: string[] = [];
    node: ast.Node;
    name: string;
    addChild(name: string, type: 'query' | 'mutation' | 'subscription' | 'proto' | 'entity') {
        const magnus = new MagnusContext();
        magnus.parent = this;
        switch (type) {
            case 'query':
                this.querys.set(name, magnus);
                break;
            case "mutation":
                this.mutations.set(name, magnus);
                break;
            case "proto":
                this.protos.set(name, magnus);
                break;
            case "subscription":
                this.subscriptions.set(name, magnus);
                break;
            case "entity":
                this.entityMap.set(name, magnus);
                break;
            default:
                break;
        }
        return magnus;
    }
    hasTypeParameter(name: string) {
        if (!name) {
            return false;
        }
        if (this.typeParameters.has(name)) {
            return true;
        }
        return false;
    }
}
export class MagnusContext {
    typeParameters: Set<string> = new Set();
    parent: MagnusTopContext;
    contextParent: MagnusContext;
    entities: string[] = [];
    type: 'query' | 'mutation' | 'subscription' | 'proto' | 'entity' = 'query';
    node: ast.Node;
    name: string;
    // 当前操作的entity
    currentEntity: string = ``;
    isSelf: boolean = false;
    // 是否属性
    isProperty: boolean = false;
    // 是否input
    isInput: boolean = false;
    isNonNull: boolean = false;
    // 参数
    params: any;

    class: ClassDef = {
        name: ``,
        relations: []
    };
    //防止无限循环
    oldName: string;
    get topName(): string {
        return this.parent && this.parent.name;
    }
    get parentName() {
        return this.topName;
    }
    // 是否需要更名
    _needChangeName: boolean;
    // 是否包含上级
    hasParentName(name: string): boolean {
        if (this.parentName === name) {
            return true;
        }
        if (this.contextParent) {
            if (this.contextParent.currentName === name) return true;
            return this.contextParent.hasParentName(name)
        }
        return false;
    }

    get needChangeName(): boolean {
        if (typeof this._needChangeName === 'boolean') return this._needChangeName;
        if (!this.currentName) return false;
        return this.currentName !== this.name;
    }
    // 新的名字
    currentName: string;

    // 首字母大写
    isUpperFirst: boolean;
    get isQuery() {
        return this.type === 'query'
    }
    get isMutation() {
        return this.type === 'mutation'
    }
    get isSubscription() {
        return this.type === 'subscription'
    }
    get isProto() {
        return this.type === 'proto';
    }
    get isEntity() {
        return this.type === 'entity';
    }
    get allEntities(): string[] {
        const entites: string[] = [];
        entitySet.forEach(entity => entites.push(entity));
        return entites;
    }
    getEntities() {
        if (this.entities.length > 0) {
            return this.entities;
        } else {
            return this.getTop().entities;
        }
    }
    getTop(): MagnusTopContext {
        return this.parent;
    }
    hasTypeParameter(name: string) {
        if (!name) {
            return false;
        }
        if (this.typeParameters.has(name)) {
            return true;
        }
        if (this.parent) {
            if (this.parent.hasTypeParameter(name)) {
                return true;
            }
        }
        return false;
    }

}
export class MangusContextManager {
    contexts: MagnusTopContext[] = [];
    entities: Set<string> = new Set();
    name: string;
    isServer: boolean;
    addContext(ctx: MagnusTopContext) {
        this.contexts.push(ctx);
        ctx.entities.map(entity => this.entities.add(entity))
    }
}
export class MagnusVisitor implements ast.Visitor {
    name: string = `MagnusVisitor`;
    collection: CollectionContext;
    constructor(public manager: MangusContextManager) { }
    visitClassDeclaration(node: ast.ClassDeclaration, context: CollectionContext) {
        this.collection = context;
        const resolver = node.getDecorator<string>('Resolver')(expressionVisitor);
        const controller = node.getDecorator<string>('Controller')(expressionVisitor);
        const magnus = node.getDecorator<MagnusOptions>('Magnus')(expressionVisitor);
        const entity = node.getDecorator<MagnusOptions>('Entity')(expressionVisitor);
        if (this.collection.isServer) {
            if (resolver !== null) {
                const ctx = new MagnusTopContext();
                ctx.entities = [];
                ctx.entities.map(entity => entitySet.add(entity));
                ctx.node = node;
                ctx.name = node.name.visit(expressionVisitor, ``)
                node.typeParameters.map(type => type.visit(this, ctx))
                node.members.map(member => member.visit(this, ctx))
                this.manager.addContext(ctx);
                return ctx;
            }
            if (magnus !== null) {
                if (magnus) {
                    const ctx = new MagnusTopContext();
                    ctx.entities = magnus.entities || [];
                    ctx.entities.map(entity => entitySet.add(entity));
                    ctx.node = node;
                    ctx.name = node.name.visit(expressionVisitor, ``)
                    node.typeParameters.map(type => type.visit(this, ctx))
                    node.members.map(member => member.visit(this, ctx))
                    this.manager.addContext(ctx)
                    return ctx;
                } else {
                    const ctx = new MagnusTopContext();
                    ctx.entities = [];
                    ctx.entities.map(entity => entitySet.add(entity));
                    ctx.node = node;
                    ctx.name = node.name.visit(expressionVisitor, ``)
                    node.typeParameters.map(type => type.visit(this, ctx))
                    node.members.map(member => member.visit(this, ctx))
                    this.manager.addContext(ctx)
                    return ctx;
                }
            }
            if (entity !== null) {
                const ctx = new MagnusTopContext();
                ctx.entities = [];
                ctx.node = node;
                ctx.name = node.name.visit(expressionVisitor, ``)
                node.typeParameters.map(type => type.visit(this, ctx))
                node.members.map(member => member.visit(this, ctx))
                this.manager.addContext(ctx);
                return ctx;
            }
        } else {
            if (resolver !== null || controller !== null) {
                const ctx = new MagnusTopContext();
                ctx.entities = [];
                ctx.entities.map(entity => entitySet.add(entity));
                ctx.node = node;
                ctx.name = node.name.visit(expressionVisitor, ``)
                node.typeParameters.map(type => type.visit(this, ctx))
                node.members.map(member => member.visit(this, ctx))
                this.manager.addContext(ctx);
                return ctx;
            }
        }
    }
    isNull(val: any): val is null {
        return val === null;
    }
    setMagnus(node: ast.GetAccessorDeclaration | ast.SetAccessorDeclaration | ast.MethodDeclaration | ast.PropertyDeclaration, context: MagnusTopContext) {
        const query = node.getDecorator<MagnusOptions>('Query')(expressionVisitor);
        const field = node.getDecorator<MagnusOptions>('Field')(expressionVisitor);
        const ResolveProperty = node.getDecorator<MagnusOptions>('ResolveProperty')(expressionVisitor);
        const subscription = node.getDecorator<MagnusOptions>('Supscription')(expressionVisitor);
        const mutation = node.getDecorator<MagnusOptions>('Mutation')(expressionVisitor);
        const proto = node.getDecorator<MagnusOptions>('Proto')(expressionVisitor);
        const grpcMethod = node.getDecorator<MagnusOptions>('GrpcMethod')(expressionVisitor);
        if (node instanceof ast.MethodDeclaration) {
            /**
             * 可以多个
             */
            if (!this.isNull(field)) {
                this.registe(node, context, field, 'entity')
            }
            if (!this.isNull(ResolveProperty)) {
                this.registe(node, context, ResolveProperty, 'entity')
            }
            if (!this.isNull(query)) {
                this.registe(node, context, query, 'query')
            }
            if (!this.isNull(mutation)) {
                this.registe(node, context, mutation, 'mutation')
            }
            if (!this.isNull(subscription)) {
                this.registe(node, context, subscription, 'subscription')
            }
            if (!this.isNull(proto)) {
                this.registe(node, context, proto, 'proto')
            }
            if (!this.isNull(grpcMethod)) {
                this.registe(node, context, grpcMethod, 'proto')
            }
        }
    }
    registe(
        node: ast.GetAccessorDeclaration | ast.SetAccessorDeclaration | ast.MethodDeclaration | ast.PropertyDeclaration,
        context: MagnusTopContext,
        query: MagnusOptions | undefined,
        type: 'query' | 'mutation' | 'subscription' | 'proto' | 'entity'
    ) {
        const ctx = context.addChild(node.name.visit(expressionVisitor, ``), type)
        ctx.name = node.name.visit(expressionVisitor, ``)
        ctx.params = query;
        if (query) {
            ctx.entities = query.entities || [];
        }
        ctx.entities.map(entity => entitySet.add(entity));
        ctx.type = type;
        ctx.node = node;
    }
    visitGetAccessorDeclaration(node: ast.GetAccessorDeclaration, context: MagnusTopContext) {
        this.setMagnus(node, context)
    }
    visitSetAccessorDeclaration(node: ast.SetAccessorDeclaration, context: MagnusTopContext) {
        this.setMagnus(node, context)
    }
    visitTypeParameterDeclaration(node: ast.TypeParameterDeclaration, context: MagnusContext) {
        const name = node.name.visit(expressionVisitor, ``);
        context.typeParameters.add(name)
    }
    visitPropertyDeclaration(node: ast.PropertyDeclaration, context: MagnusTopContext) {
        this.setMagnus(node, context)
    }
    visitMethodDeclaration(node: ast.MethodDeclaration, context: MagnusTopContext) {
        this.setMagnus(node, context)
    }
    // 搜集依赖信息
    visitConstructorDeclaration(node: ast.ConstructorDeclaration, context: MagnusContext) { }
}
