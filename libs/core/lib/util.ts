import { Type } from './type';
import { ValueProvider, ExistingProvider, FactoryProvider, ConstructorProvider, StaticClassProvider, ClassProvider } from './provider';
export const AnyDecorator = (...args: any[]) => { }

export interface InjectorTypeWithProviders<T> {
    module: InjectorType<T>;
    providers?: (Type<any> | ValueProvider | ExistingProvider | FactoryProvider | ConstructorProvider |
        StaticClassProvider | ClassProvider | any[])[];
}

export interface InjectorDef<T> {
    factory: () => T;
    providers: (Type<any> | ValueProvider | ExistingProvider | FactoryProvider | ConstructorProvider |
        StaticClassProvider | ClassProvider | any[])[];
    imports: (InjectorType<any> | InjectorTypeWithProviders<any>)[];
}

export interface InjectorType<T> extends Type<T> {
    injectorDef: InjectorDef<T>;
}

export interface InjectableDef<T = any> {
    providedIn: InjectorType<any> | 'root' | 'any' | null;
    token: unknown;
    factory: (t?: Type<any>) => T;
    value: T | undefined;
}

export function defineInjectable<T>(opts: {
    token: unknown,
    providedIn?: Type<any> | 'root' | 'any' | null,
    factory: () => T,
}): InjectableDef<T> {
    return {
        token: opts.token,
        providedIn: opts.providedIn as any || null,
        factory: opts.factory,
        value: undefined,
    };
}
