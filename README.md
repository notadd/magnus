<p align="center">
    <img style="margin: 0 auto;" width="220px" src="./logo.jpg"/>
</p>

### 功能特点

- 根据 Typescript 自动生成`.graphql`和`.proto`配置文件（灵活）
- 生成自动支持按条件搜索、分页、排序的增删改查
- 自动更新数据库结构
- 局域网内项目 proto 同步
- 支持微服务架构

<p align="center">
<img style="margin: 0 auto;" width="650px" src="static/Functional-structure-CN.svg"/>
</p>

<p align="center">
<img style="margin: 0 auto;" width="900px" src="static/Functional-diciaion-CN.svg"/>
</p>

<p align="center">
<img style="margin: 0 auto;" width="450px" src="static/sync-CN.svg"/>
</p>

<p align="center">
<img style="margin: 0 auto;" width="900px" src="static/magnus-graphql-CN.png"/>
</p>


## install

```
npm install -g @notadd/magnus
```

## add magnus.json
```json
{
  "prefix": "", // 前缀
  "inputs": [// 输入
    "demo/src/**/*.ts"
  ],
  "output": "demo/config",// 输出
  "assets": "demo/assets",// 静态资源
  "debug": false,// 调试
  "name": "demo",// 名称
  "client": [//客户端
    "demo/src/**/*.graphql"
  ],
  "hasGrpc": true,// 是否提供grpc
  "runner": {// magnus runner目录
    "name": "runner",
    "path": "../runner"
  },// 定义文件
  "types": "../../config/demo/magnus.server",
  "def": "demo/assets/demo/magnus.server.graphql"// 定义graphql文件
}
```

## run magnus

```ts
magnus --watch 监听文件变化
magnus 单次运行
```

### orm

```ts
import { Magnus, MagnusBase, Mutation, Query, Where, Order } from '@notadd/magnus-core';
import { getRepository, SelectQueryBuilder, FindOperator, FindConditions } from 'typeorm';
import {
    Department,
    Role,
    RoleGroup,
    SafetyScoreLog,
    SafetyScoreRule,
    Station,
    System,
    SystemEvent,
    SystemRight,
    ToDoItem,
    User,
    UserLoginLog
} from '../entities';
import { PageLimit } from './types';
@Magnus({
    entities: [
        User,
        System,
        SystemEvent,
        SystemRight,
        Department,
        Role,
        Station,
        ToDoItem,
        RoleGroup,
        UserLoginLog,
        SafetyScoreLog,
        SafetyScoreRule
    ]
})
export class Controller<T> extends MagnusBase<T> {
    get repository() {
        return getRepository<T>(this.entity);
    }
	/**
	 * 没有就插入，有就更新
	 * @param entity  要保存的数据
	 */
    @Mutation()
    async save(entity: T): Promise<T> {
        const item = this.repository.create(entity);
        return await this.repository.save(item);
    }

	/**
	 * 插入数据
	 * @param entity 要插入的数据
	 */
    @Mutation()
    async insert(entity: T): Promise<T> {
        const item = this.repository.create(entity);
        const res = await this.repository.insert(item);
        return item;
    }
	/**
	 * 通过指定条件获取一条数据
	 * @param entity 条件
	 */
    @Query()
    async get(entity: Where<T>): Promise<T | undefined> {
        const selectAndRelations = this.createSelectAndRelations();
        const res = await this.repository.findOne({
            where: entity,
            select: selectAndRelations.select,
            relations: selectAndRelations.relations
        });
        return res;
    }

    /**
     * 通过制定条件获取一组数据
     * @param entity 条件
     */
    @Query()
    async find(entity: Where<T>, order: Order<T>, limit: PageLimit = {
        page: 1,
        psize: 20
    }): Promise<T[]> {
        const selectAndRelations = this.createSelectAndRelations();
        const where = createWhere(entity);
        const res = await this.repository.find({
            select: selectAndRelations.select,
            where,
            relations: selectAndRelations.relations,
            skip: (limit.page - 1) * limit.psize,
            take: limit.psize,
            order: order
        });
        return res;
    }

    /**
     * 删除
     * @param id 根据id删除
     */
    @Query()
    async delete(id: number): Promise<boolean> {
        const res = await this.repository.delete(id);
        if (res) return true;
        return false;
    }

}
```

### 覆盖orm
```ts
@Magnus()
export class Controller2 extends MagnusBase<User> {
    tablename: string = 'User';
    /**
     * 覆盖Controller中的getUser，单独处理
     **/
    @Query()
    getUser(): User {
        return {
            id: 1,
        };
    }
}
```

## 使用 编写client.graphql 自动生成对应client.ts文件函数
```graphql
query getUser($user: UserInput!){
    getUser(entity: $user){
        id,
        nickname
    }
}
```

```ts
import { getUser } from './client.ts'
getUser({id: 1}).then(res=>res.getUser).then(res=>({
    id: res.id,
    nickname: res.nickname
}))
```
