import { client } from '@notadd/magnus-graphql';
interface TypeDef {
    [key: string]: { name: string, relation: string, entity: string }[]
}
interface Entities {
    [key: string]: Type<any>;
}
interface Type<T> extends Function {
    new(...args: any[]): T;
}
export abstract class MagnusBase<T = any> {
    readonly entity: Type<T>;
    readonly tablename: string;
    readonly selection: client.SelectionSetJson;
    readonly relations: { name: string, relation: string, entity: string }[];
    readonly typeDef: TypeDef;
    readonly entities: Entities;
    constructor(tablename: string, selection: any, def: TypeDef, entities: Entities) {
        this.tablename = this.tablename || tablename;
        this.selection = selection;
        this.typeDef = def;
        this.entities = entities;
        this.relations = this.typeDef[this.tablename];
        this.entity = this.entities[this.tablename];
    }
    createSelectAndRelations(): {
        select: any[],
        relations: string[]
    } {
        const select: any[] = [];
        const relations: any[] = [];
        Object.keys(this.selection).map(key => {
            const relation = this.relations.find(it => it.name === key)
            if (!!relation) {
                if (relation.relation !== 'ResolveProperty') {
                    relations.push(key)
                }
            } else {
                select.push(key)
            }
        });
        return {
            select,
            relations
        }
    }
    createEntity(entity?: Partial<T>) {
        return new this.entity(entity)
    }
    createEntities(entities: Partial<T>[]) {
        return entities.map(entity => this.createEntity(entity))
    }
}

export class MagnusEntity<T> {
    constructor(entity: Partial<T>) {
        if (entity) {
            Object.keys(entity).map((key: string) => {
                (this as any)[key] = (entity as any)[key];
            })
        }
    }
}