import {
    Entity,
    OneToMany,
    JoinTable,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    ManyToMany,
    getRepository,
} from 'typeorm';
import { ToDoItem } from './toDoItem';
import { Station } from './station';
import { UserLoginLog } from './userLogin';
import { SafetyScoreLog } from './safetyScoreLog';
import { ResolveProperty, Parent, Selection, Where, Order, Relation } from '@notadd/magnus-core';
import { PageLimit } from './types';
import { createWhere } from './controller';
/**
 * 用户表
 */
@Entity()
export class User {
	/**
	 * 用户编号
	 */
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id?: number;

	/**
	 * 用户名
	 */
    @Column({
        type: 'varchar',
        default: ``,
        unique: true
    })
    username: string;

	/**
	 * 邮箱
	 */
    @Column({
        type: 'varchar',
        default: ``
    })
    email?: string;

	/**
	 * 头像
	 */
    @Column({
        type: 'varchar',
        default: ``
    })
    avatar?: string;

	/**
	 * 电话号码
	 */
    @Column({
        type: 'varchar',
        default: ``
    })
    mobile?: string;

	/**
	 * 密码
	 */
    @Column({
        type: 'varchar',
        default: ``
    })
    password?: string;

	/**
	 *  1: 账户正常 0:未绑定 -1:刚解冻 -2: 已被封
	 */
    @Column({
        type: 'smallint',
        default: 0
    })
    status?: number;

	/**
	 * 随机码
	 */
    @Column({
        type: 'varchar',
        length: 20,
        default: ``
    })
    randomCode?: string;

	/**
	 * 密码是否被重置
	 */
    @Column({
        type: 'smallint',
        default: 0,
        comment: '0正常,1密码已重置'
    })
    isRestPassword?: boolean;

	/**
	 *  密码更改时间
	 */
    @CreateDateColumn({
        type: 'timestamptz',
        transformer: {
            to: (value: number) => {
                let date = new Date();
                if (value) {
                    date = new Date(value);
                }
                return date;
            },
            from: (value: string) => {
                return new Date(value).getTime();
            }
        }
    })
    passwordDate?: number;

	/**
	 * 创建时间
	 */
    @CreateDateColumn({
        type: 'timestamptz',
        transformer: {
            to: (value: number) => {
                let date = new Date();
                if (value) {
                    date = new Date(value);
                }
                return date;
            },
            from: (value: string) => {
                return new Date(value).getTime();
            }
        }
    })
    createDate?: number;

	/**
	 * 这个用户的创建人是谁
	 */
    @ManyToOne(() => User, type => type.createUsers)
    @JoinTable({
        name: 'createUserId'
    })
    createUser?: User;
    /**
     * 创建人的uid
     */
    createUserId: number;

    // 用户创建的所有用户
    @OneToMany(() => User, type => type.createUser)
    createUsers?: User[];

	/**
	 * 安全分
	 */
    @Column({
        default: 100
    })
    safetyScore?: number;

	/**
	 * 用户的代办事项
	 */
    @OneToMany(() => ToDoItem, type => type.toUser)
    toDoItems?: ToDoItem[];

    /**
     * 发布者
     */
    @OneToMany(() => ToDoItem, type => type.fromUser)
    mineToDoItems?: ToDoItem[];

    @ResolveProperty()
    async getToDoItems(@Selection() selection: any, where?: Where<ToDoItem>, order?: Order<ToDoItem>, limit?: PageLimit): Promise<ToDoItem[]> {
        const copyWhere: any = {
            ...where,
            toUserId: this.id
        }
        const { page, psize } = limit || { page: 1, psize: 20 }
        const relations = Object.keys(selection).filter(key => ['toUser'].includes(key))
        const selects = Object.keys(selection).filter(key => !['toUser'].includes(key))
        const builder = getRepository(ToDoItem).createQueryBuilder('entity');
        builder.addSelect(selects);
        if (relations.length > 0) {
            throw new Error(`getToDoItems do not support relations!!`)
        }
        Object.keys(copyWhere).map(key => {
            const [column, type] = key.split('_');
            const value = copyWhere[key];
            switch (type) {
                case 'Not':
                    builder.andWhere(`entity.${column} != :${key}`, { [`${key}`]: value })
                    break;
                case 'In':
                    builder.andWhere(`entity.${column} in :${key}`, { [`${key}`]: value })
                    break;
                case 'NotIn':
                    builder.andWhere(`entity.${column} not in :${key}`, { [`${key}`]: value })
                    break;
                case 'Lt':
                    builder.andWhere(`entity.${column} < :${key}`, { [`${key}`]: value })
                    break;
                case 'Lte':
                    builder.andWhere(`entity.${column} <= :${key}`, { [`${key}`]: value })
                    break;
                case 'Gt':
                    builder.andWhere(`entity.${column} > :${key}`, { [`${key}`]: value })
                    break;
                case 'Gte':
                    builder.andWhere(`entity.${column} >= :${key}`, { [`${key}`]: value })
                    break;
                case 'Contains':
                    builder.andWhere(`entity.${column} like :${key}`, { [`${key}`]: `%${value}%` })
                    break;
                case 'NotContains':
                    builder.andWhere(`entity.${column} not like :${key}`, { [`${key}`]: `%${value}%` })
                    break;
                case 'StartsWith':
                    builder.andWhere(`entity.${column} like :${key}`, { [`${key}`]: `%${value}` })
                    break;
                case 'NotStartsWith':
                    builder.andWhere(`entity.${column} not like :${key}`, { [`${key}`]: `%${value}` })
                    break;
                case 'EndsWith':
                    builder.andWhere(`entity.${column} like :${key}`, { [`${key}`]: `${value}%` })
                    break;
                case 'NotEndsWith':
                    builder.andWhere(`entity.${column} not like :${key}`, { [`${key}`]: `${value}%` })
                    break;
                default:
                    builder.andWhere(`entity.${column} = :${key}`, { [`${key}`]: copyWhere[key] })
                    break;
            }
        })
        builder.offset((page - 1) * psize);
        builder.take(psize);
        return builder.getMany()
    }

	/**
	 * 用户岗位
	 */
    @ManyToMany(() => Station, type => type.users)
    stations?: Station[];
    @ResolveProperty()
    async getStations(where?: Where<Station>, order?: Order<Station>, limit?: PageLimit): Promise<Station[]> {
        return getRepository(Station).find();
    }
	/**
	 * 用户的登录记录
	 */
    @OneToMany(() => UserLoginLog, type => type.user)
    loginLogs?: UserLoginLog[];
    @ResolveProperty()
    async getUserLoginLogs(where?: Where<UserLoginLog>, order?: Order<UserLoginLog>, limit?: PageLimit): Promise<UserLoginLog[]> {
        return getRepository(UserLoginLog).find();
    }
	/**
	 * 用户的安全分扣分记录
	 */
    @OneToMany(() => SafetyScoreLog, type => type.user)
    safetyScoreLogs?: SafetyScoreLog[];
    @ResolveProperty()
    async getSafetyScoreLogs(where?: Where<SafetyScoreLog>, order?: Order<SafetyScoreLog>, limit?: PageLimit): Promise<SafetyScoreLog[]> {
        return getRepository(SafetyScoreLog).find();
    }
    @OneToMany(() => Station, type => type.createUser)
    createStations: Station[];
    @ResolveProperty()
    async getCreateStations(where?: Where<Station>, order?: Order<Station>, limit?: PageLimit): Promise<Station[]> {
        return getRepository(Station).find()
    }
}
