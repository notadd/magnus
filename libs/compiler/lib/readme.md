## 扫描ts自动生成文件
> 描述文件 用于创建resolver
**/*.metadata.json
> graphql文件 graphql的配置文件
magnus.graphql
> graphql AST 文件 ast配置文件
magnus.json
> proto 文件 proto配置文件
magnus.proto
> ts文件 接口文件
magnus.ts

##### test.ts
```ts
import { Magnus, Query, DeepPartial } from '@notadd/magnus-core';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    uid: number;
    @Column()
    username: string;
    @Column()
    password: string;
    @CreateDateColumn()
    createDate: string;
    @UpdateDateColumn()
    updateDate: string;
}

@Magnus({
    entities: [
        User
    ]
})
export class Demo<T> {
    /**
     * 这里要尽量返回全部的 这样才能让调用的时候拼接想要的结果
     **/
    @Query()
    async get(): Promise<T> {
        return {};
    }

    @Mutation()
    async add(user: T): Promise<T>{
        return {}
    }

    @Subscription()
    async whenAdd(): Promise<T>{
        return {}
    }
}
```

##### 生成的使用接口,magnus.ts

```ts
import { DeepPartial } from "@notadd/magnus-core";
/**
 * type User
 */
export abstract class User {
    uid: number;
    username: string;
    password: string;
    createDate: string;
    updateDate: string;
}
/**
 * type Query
 */
export abstract class Query {
    abstract getUser<T extends DeepPartial<User>>(uid: number): Promise<T>;
}
/**
 * type Mutation
 */
export abstract class Mutation {
    abstract addUser<T extends DeepPartial<User>>(user: User): Promise<T>;
}
/**
 * type Subscription
 */
export abstract class Subscription {
    abstract whenAddUsear<T extends DeepPartial<User>>(): Promise<T>;
}
/**
 * type Magnus
 */
export type MagnusTypes = Query| Mutation| Subscription;
export abstract class Magnus {
    query: Query;
    mutation: Mutation;
    subscription: Subscription;
    abstract run<T extends keyof MagnusTypes>(): T;
}
/**
 * 导出
 */
export declare const magnus: Magnus;
/**
 * 调用接口
 */
magnus.query.getUser<{ username: string }>(1).then(res => res.username)
```
