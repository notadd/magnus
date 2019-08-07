import { AnyDecorator } from './util';
import { Type } from './type';
import { Provider } from './provider';
/**
 * magnus相关
 */
export interface MagnusOptions {
    entities?: Type<any>[];
}
export const Magnus = (options?: MagnusOptions) => AnyDecorator;
/**
 * module 相关参数
 */
export interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
}
export interface ModuleOptions {
    providers?: Provider[];
    imports?: Array<Type<any> | ModuleWithProviders<{}> | any[]>;
    magnus?: Array<Type<any>>;
}
export const Module = (options?: ModuleOptions) => AnyDecorator;
export const NgModule = Module;

/**
 * proto相关
 */
export const Proto = (options?: MagnusOptions) => AnyDecorator;

/**
 * graphql相关
 */

/**
 * Scalar 相关
 */
export interface ScalarOptions {
    name?: string;
}
export const Scalar = (options?: ScalarOptions) => AnyDecorator;
/**
 * directive相关
 */
export interface DirectiveOptions {
    name?: string;
}
export const Directive = (options?: DirectiveOptions) => AnyDecorator;
/**
 * query相关
 * @param options 
 */
export const Query = (options?: MagnusOptions) => AnyDecorator;
/**
 * mutation相关
 * @param options 
 */
export const Mutation = (options?: MagnusOptions) => AnyDecorator;
/**
 * subscription相关
 */
export const Subscription = (options?: MagnusOptions) => AnyDecorator;
/**
 * inject
 * @param type 依赖注入
 * 简单依赖注入，只支持全局
 */
export const Inject = (type?: Type<any>) => AnyDecorator;
/**
 * 可注入的对象
 * @param type 
 */
export interface InjectableOptions {
    providedIn: Type<any> | 'root' | 'any' | null;
}
export const Injectable = (options?: InjectableOptions) => AnyDecorator;
/**
 * Resolver
 */
export const Resolver = (name?: string) => AnyDecorator;
/**
 * 属性
 */
export const ResolveProperty = (name?: string) => AnyDecorator;
/**
 * 参数
 */
export const Parent = () => AnyDecorator;
/**
 * 选择
 */
export const Selection = () => AnyDecorator;
/**
 * 选择
 */
export const Relation = () => AnyDecorator;

export const Field = () => AnyDecorator;

/**
 * 权限相关
 */
export interface PermissionOptions {
    /**
     * 权限名
     */
    title: string;
    /**
     * 权限简介
     */
    desc: string;
    /**
     * 附加数据
     */
    data?: any;
    /**
     * 上级
     */
    namespace?: string;
}
export const Permission = (options: PermissionOptions) => AnyDecorator;
