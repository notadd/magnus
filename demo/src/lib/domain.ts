import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany } from 'typeorm';
import { Department } from './department';
import { ResolveProperty } from '@notadd/magnus-core';
/**
 * 域
 */
@Entity()
export class Domain {
    @PrimaryGeneratedColumn()
    id: number;

	/**
	 * 域标题
	 */
    @Column()
    title: string;

	/**
	 * 域编号
	 */
    @Column()
    code: string;

	/**
	 * 域状态
	 */
    @Column({
        default: 0
    })
    status?: number;

	/**
	 * 创建人
	 */
    @Column({
        default: 0
    })
    createUser?: number;

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
	 * 部门
	 */
    @OneToMany(() => Department, type => type.domain)
    departments?: Department[];

    @ResolveProperty()
    async getDepartments(): Promise<Department[]> {
        return [];
    }
}
