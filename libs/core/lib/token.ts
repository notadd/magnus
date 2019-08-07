import { InjectableDef, defineInjectable } from './util';
import { Type } from './type';
export class InjectionToken<T> {
    readonly metadataName = 'InjectionToken';
    readonly injectableDef: InjectableDef | undefined;
    constructor(
        protected _desc: string,
        options?: {
            providedIn?: Type<any> | 'root' | null,
            factory: () => T
        }
    ) {
        this.injectableDef = undefined;
        if (options) {
            this.injectableDef = defineInjectable({
                token: this,
                providedIn: options.providedIn || 'root',
                factory: options.factory,
            });
        }
    }
    toString(): string { return `InjectionToken ${this._desc}`; }
}