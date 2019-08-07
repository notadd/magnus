import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { Station } from './station';
import { SystemRight } from './systemRight';
import { RoleGroup } from './roleGroup';
import { ResolveProperty } from '@notadd/magnus-core';
/**
 * 角色表
 */
@Entity()
export class Role {
	/**
	 * 序号
	 */
    @PrimaryGeneratedColumn()
    id?: number;

	/**
	 * 角色标识
	 */
    @Column()
    code: string;

	/**
	 * 角色名称
	 */
    @Column()
    title: string;

	/**
	 * 角色描述
	 */
    @Column({
        default: ``
    })
    desc?: string;

	/**
	 * 一个角色可以有多个权限
	 */
    @OneToMany(() => SystemRight, type => type.toRoles)
    rights?: SystemRight[];
    @ResolveProperty()
    async getSystemRights(): Promise<SystemRight[]> {
        return [];
    }
	/**
	 * 一个角色 可以使用某个岗位的职员
	 */
    @ManyToMany(() => Station, type => type.canUseRoles)
    canUseStations?: Station[];

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
	 * 更新时间
	 */
    @UpdateDateColumn({
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
    updateDate?: number;

	/**
	 * 一个角色 被那几个角色组使用
	 */
    @ManyToOne(() => RoleGroup, type => type.roles)
    group?: RoleGroup;
}
