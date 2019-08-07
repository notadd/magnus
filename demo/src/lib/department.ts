import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    JoinTable
} from 'typeorm';
import { Station } from './station';
import { Domain } from './domain';
import { ResolveProperty } from '@notadd/magnus-core'
/**
 * 部门表
 */
@Entity()
export class Department {
	/**
	 * 部门编号
	 */
    @PrimaryGeneratedColumn({
        comment: '部门编号'
    })
    id?: number;

	/**
	 * 部门名称
	 */
    @Column({
        comment: '部门名称'
    })
    title?: string;

	/**
	 * 部门状态
	 */
    @Column({
        comment: '部门状态',
        default: 0
    })
    status?: number;

	/**
	 * 是否显示
	 */
    @Column({
        comment: '是否显示',
        default: true
    })
    shown?: boolean;

	/**
	 * 上级部门
	 */
    @ManyToOne(() => Department, type => type.children)
    parent?: Department;

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
    createDate: number;

	/**
	 * 下级部门
	 */
    @OneToMany(() => Department, type => type.parent)
    children?: Department[];

    @ResolveProperty()
    async getChildren(): Promise<Department[]> {
        return [];
    }

	/**
	 * 一个部门可以有多个岗位
	 */
    @OneToMany(() => Station, type => type.department)
    stations?: Station[];
    @ResolveProperty()
    async getStations(): Promise<Station[]> {
        return [];
    }
	/**
	 * 域
	 */
    @ManyToOne(() => Domain, type => type.departments)
    @JoinTable({
        name: 'domainId'
    })
    domain?: Domain;
    domainId: number;
}
