export type Double = number;
export type Float = number;
export type Int32 = number;
export type Uint32 = number;
export type Sint32 = number;
export type Fixed32 = number;
export type Sfixed32 = number;
export type Int64 = number;
export type Uint64 = number;
export type Sint64 = number;
export type Fixed64 = number;
export type Sfixed64 = number;
export type Bool = boolean;
export type String = string;
export type Bytes = number[];
export type Empty = {}

export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export type Order<T> = {
    [P in keyof T]?: "ASC" | "DESC"
}
export type Where<T> = {
    [key: string]: any;
}