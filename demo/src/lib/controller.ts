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

export function createWhere<T>(where: any): FindConditions<T> {
    const res: any = {};
    Object.keys(where).map(key => {
        const [column, operator] = key.split('_');
        res[column] = createFindOperator(key, where[key])
    })
    return res;
}
function createFindOperator(key: string, value: any) {
    const [column, operator] = key.split('_');
    if (column === 'NOT') {
        const res: any = {};
        Object.keys(value).map(notKey => {
            const [column, operator] = notKey.split('_');
            res[column] = createFindOperator(notKey, value[notKey])
        })
        return new FindOperator('not', res)
    }
    if (column === 'AND') {
        const res: any = {};
        Object.keys(value).map(notKey => {
            const [column, operator] = notKey.split('_');
            res[column] = createFindOperator(notKey, value[notKey])
        })
        return new FindOperator('raw', res)
    }
    if (column === 'OR') {
        const res: any = {};
        Object.keys(value).map(notKey => {
            const [column, operator] = notKey.split('_');
            res[column] = createFindOperator(notKey, value[notKey])
        })
        return new FindOperator('any', res)
    }
    return createOperator(operator, value)
}
function createOperator(operator: string, value: any) {
    switch (operator) {
        case 'Not':
            return new FindOperator('not', value);
        case 'In':
            return new FindOperator('in', value)
        case 'NotIn':
            return new FindOperator('not', new FindOperator('in', value))
        case 'Lt':
            return new FindOperator('lessThan', value)
        case 'Lte':
            return new FindOperator('lessThanOrEqual', value)
        case 'Gt':
            return new FindOperator('moreThan', value)
        case 'Gte':
            return new FindOperator('moreThanOrEqual', value)
        case 'Contains':
            return new FindOperator('like', `%${value}%`)
        case 'NotContains':
            return new FindOperator('not', new FindOperator('like', `%${value}%`))
        case 'StartsWith':
            return new FindOperator('like', `%${value}`)
        case 'NotStartsWith':
            return new FindOperator('not', new FindOperator('like', `%${value}`))
        case 'EndsWith':
            return new FindOperator('like', `${value}%`);
        case 'NotEndsWith':
            return new FindOperator('not', new FindOperator('like', `${value}%`))
        default:
            return new FindOperator('equal', value)
    }
}