import {
    Entity,
    PrimaryGeneratedColumn,
    JoinTable,
    Column,
    CreateDateColumn,
    ManyToOne,
    ManyToMany
} from 'typeorm';
import { Department } from './department';
import { Role } from './role';
import { User } from './user';
import { RoleGroup } from './roleGroup';
import { ResolveProperty } from '@notadd/magnus-core';
/**
 * 岗位表
 */
@Entity()
export class Station {
	/**
	 * 岗位序号
	 */
    @PrimaryGeneratedColumn()
    id?: number;

	/**
	 * 岗位标题
	 */
    @Column()
    title?: string;

	/**
	 * 岗位描述
	 */
    @Column({
        default: ``
    })
    desc?: string;

	/**
	 * 岗位标识码
	 */
    @Column()
    code?: string;

	/**
	 * 岗位责任
	 */
    @Column({
        default: ''
    })
    responsibilities?: string;

	/**
	 * 岗位要求
	 */
    @Column({
        default: ''
    })
    requirements?: string;

	/**
	 * 岗位状态
	 */
    @Column({
        default: 0
    })
    status: number;

	/**
	 * 创建用户
	 */
    @ManyToOne(() => User, type => type.createStations)
    createUser?: User;

	/**
	 * 创建日期
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
                return new Date(value).getTime().toString();
            }
        }
    })
    createDate?: string;

	/**
	 * 每个岗位有一个部门
	 */
    @ManyToOne(() => Department, type => type.stations)
    department?: Department;

	/**
	 * 某个岗位可以被什么角色使用
	 */
    @ManyToMany(() => Role, type => type.canUseStations)
    @JoinTable({
        name: 'station_canuse_role'
    })
    canUseRoles?: Role[];

    @ManyToMany(() => User, type => type.stations)
    @JoinTable({
        name: 'station_user'
    })
    users?: User[];
    @ResolveProperty()
    async getUsers(): Promise<User[]> {
        return [];
    }
	/**
	 * 一个岗位有一个role group
	 */
    @ManyToOne(() => RoleGroup, type => type.stations)
    roleGroup: RoleGroup;
}
