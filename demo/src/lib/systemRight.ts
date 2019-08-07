import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToOne,
	ManyToMany,
	JoinTable
} from 'typeorm';
import { System } from './system';
import { Role } from './role';

/**
 * 模块来源权限
 */
@Entity()
export class SystemRight {
	@PrimaryGeneratedColumn()
	id?: number;

	/**
	 * 权限类型
	 * 页面权限、数据权限、功能权限
	 */
	@Column()
	type: string;

	/**
	 * 权限名
	 */
	@Column()
	title: string;

	/**
	 * 命名空间
	 */
	@Column()
	namespace?: string;

	/**
	 * 权限代号
	 */
	@Column()
	code: string;

	/**
	 * 权限链接
	 */
	link?: string;

	/**
	 * 来源模块
	 */
	@ManyToOne(() => System, type => type.rights)
	@JoinTable({
		name: 'fromSystemId'
	})
	fromSystem?: System;

	/**
	 * 可用角色
	 */
	@ManyToOne(() => Role, type => type.rights)
	toRoles?: Role;
}
