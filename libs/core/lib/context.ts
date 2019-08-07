
import { graphql, GraphQLResolveInfo, DocumentNode } from 'graphql';
import { ClientVisitor, ParseVisitor, ast } from '@notadd/magnus-graphql';
import { upperFirst } from 'lodash';
import { scalars } from '@notadd/magnus-graphql';
import { makeExecutableSchema } from 'graphql-tools';
interface Type<T> extends Function {
    new(...args: any[]): T;
}
type ClassName = string;
type MethodName = string;
type TableName = string;
type FieldName = string;
type Arguments = { name: string, type: string, index: number, decorator: string }[];
export type HandlerDef = [FieldName, ClassName, TableName, MethodName, Arguments];
export interface HandlerDefMap {
    [key: string]: HandlerDef[];
}
type Handler = (args: any, selectionSet: any) => any;
export interface InjectMap {
    [key: string]: Type<any>;
}
export interface ClassDef { [key: string]: string[] };

export function createFactoryByMap(map: HandlerDefMap, injectDef: InjectMap, entityDef: ClassDef, entities: InjectMap): { [key: string]: { [key: string]: Handler } } {
    const factory: { [key: string]: { [key: string]: Handler } } = {};
    Object.keys(map).map(operationName => {
        const items = map[operationName];
        const obj: any = {};
        items.forEach(it => {
            const [fieldName, className, tableName, methodName, argsDef] = it;
            obj[fieldName] = (args: any, selectionSet: any) => {
                const Type = injectDef[className];
                const controller = new Type(tableName, selectionSet, entityDef, entities);
                return controller[methodName](...argsDef.map(arg => args[arg.name]));
            };
        });
        factory[operationName] = obj;
    });
    return factory;
}

export function createFactory(handlerDef: HandlerDefMap, injectDef: InjectMap, entityDef: ClassDef, entities: InjectMap) {
    const map = createFactoryByMap(handlerDef, injectDef, entityDef, entities);
    return (operation: string, name: string, args: any, selectionSet: any) => {
        return map[operation][name](args, selectionSet);
    };
}

export function createResolver(handlerDef: HandlerDefMap, injectDef: InjectMap, entityDef: ClassDef, entities: InjectMap) {
    const map = createFactoryByMap(handlerDef, injectDef, entityDef, entities);
    const resolver: any = scalars;
    const client = new ClientVisitor();
    const parse = new ParseVisitor();
    Object.keys(map).map((key: string) => {
        const handler = map[key];
        resolver[upperFirst(key)] = {}
        Object.keys(handler).map(hKey => {
            const item = handler[hKey];
            resolver[upperFirst(key)][hKey] = async (source: any, args: any, context: any, info: GraphQLResolveInfo) => {
                const fieldName = info.fieldName;
                let result: any;
                await Promise.all(info.fieldNodes.map(async field => {
                    let node = new ast.FieldAst();
                    node = node.visit(parse, field);
                    const field2 = node.visit(client, args);
                    const typeSource = typeof source;
                    const selfhandlerDef = handlerDef[key].find(it => it[3] === fieldName);
                    if (selfhandlerDef && typeSource === 'object') {
                        const params = selfhandlerDef[4];
                        const parameters = new Array(params.length);
                        const selection = field2.selectionSet
                        params.map(par => {
                            const { name, type, index, decorator } = par;
                            if (decorator === 'Selection') {
                                parameters[index] = selection;
                            }
                            else if (decorator === 'Parent') {
                                parameters[index] = source;
                            }
                            else if (decorator === 'Relation') {
                                parameters[index] = entityDef;
                            }
                            else {
                                parameters[index] = args[name];
                            }
                        })
                        result = await source[fieldName](...parameters)
                    }
                    else if (typeSource === 'undefined') {
                        result = item(args, field2.selectionSet)
                    } else {
                        result = source;
                    }
                }));
                return result;
            }
        });
    });
    return resolver;
}
export function createGraphql(item: HandlerDef, operation: string, selection: string) {
    let str = ``;
    if (item[4].length > 0) {
        const parameters = item[4].map(it => `${it.name}: $${it.name}`).join(', ');
        str = `${operation} ${item[0]}(${item[4].map(it => `$${it.name}: ${it.type}`).join(', ')}) { ${item[0]}(${parameters}) ${selection} }`;
    } else {
        str = `${operation} { ${item[0]} ${selection}}`
    }
    return str;
}
interface IError {
    errors: any[];
}
interface IRunner {
    <T>(source: string, variableValues?: any): Promise<T>;
    [key: string]: any;
}
export function createRunner(map: HandlerDefMap, context: DocumentNode, injectDef: InjectMap, entityDef: ClassDef, entities: InjectMap) {
    const resolvers = createResolver(map, injectDef, entityDef, entities);
    const schema = makeExecutableSchema({
        typeDefs: context,
        resolvers
    });
    const rootValue = undefined;
    const contextValue = undefined;
    const operationName = ``;
    const run = <T>(source: string, variableValues: any = {}): Promise<T> => {
        return graphql({
            schema,
            source,
            rootValue,
            contextValue,
            variableValues,
            operationName
        }).then(res => {
            if (res.errors) {
                throw new Error(`${res.errors.join('\n')}`)
            }
            return res.data as T;
        });
    };
    const magnus: IRunner = run;
    Object.keys(map).map(key => {
        const items = map[key];
        magnus[key] = {};
        items.map(item => {
            magnus[key][item[0]] = async (...variables: any[]) => {
                const length = variables.length;
                let graphql = ``
                if (length > 0) {
                    const selection = variables[length - 1];
                    graphql = createGraphql(item, key, selection);
                } else {
                    graphql = createGraphql(item, key, ``);
                }
                const args = item[4];
                const res: any = {};
                args.map((arg, index) => {
                    res[arg.name] = variables[index];
                });
                return run(graphql, res).then((res: any) => {
                    if (res.errors) return res;
                    if (res) return res[item[0]];
                })
            }
        });
    });
    return magnus;
}
