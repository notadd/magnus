export interface Type<T> extends Function {
    new(...args: any[]): T;
}
export type StringToken<T> = string & { type: T };
