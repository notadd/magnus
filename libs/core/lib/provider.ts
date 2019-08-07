import { Type } from './type';
export interface ValueSansProvider {
    useValue: any;
}
export interface ValueProvider extends ValueSansProvider {
    provide: any;
    multi?: boolean;
}
export interface StaticClassSansProvider {
    useClass: Type<any>;
    deps: any[];
}
export interface StaticClassProvider extends StaticClassSansProvider {
    provide: any;
    multi?: boolean;
}
export interface ConstructorSansProvider {
    deps?: any[];
}
export interface ConstructorProvider extends ConstructorSansProvider {
    provide: Type<any>;
    multi?: boolean;
}
export interface ExistingSansProvider {
    useExisting: any;
}
export interface ExistingProvider extends ExistingSansProvider {
    provide: any;
    multi?: boolean;
}
export interface FactorySansProvider {
    useFactory: Function;
    deps?: any[];
}
export interface FactoryProvider extends FactorySansProvider {
    provide: any;
    multi?: boolean;
}
export type StaticProvider = ValueProvider | ExistingProvider | StaticClassProvider |
    ConstructorProvider | FactoryProvider | any[];
export interface TypeProvider extends Type<any> { }

export interface ClassSansProvider {
    useClass: Type<any>;
}

export interface ClassProvider extends ClassSansProvider {
    provide: any;
    multi?: boolean;
}

export type Provider = TypeProvider | ValueProvider | ClassProvider | ConstructorProvider |
    ExistingProvider | FactoryProvider | any[];
export type ProcessProvidersFunction = (providers: Provider[]) => Provider[];
