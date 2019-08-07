import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { ToDoItem } from './toDoItem';
import { SystemRight } from './systemRight';
import { SystemEvent } from './systemEvent';
import { ResolveProperty } from '@notadd/magnus-core';
/**
 * 子系统 子模块
 */
@Entity()
export class System {
    @PrimaryGeneratedColumn()
    id?: number;
	/**
	 * 模块名
	 */
    @Column()
    title: string;

	/**
	 * 系统缩略图片
	 */
    @Column({
        default: ``
    })
    image?: string;

	/**
	 * 首页链接
	 */
    @Column({
        default: ``
    })
    link?: string;

	/**
	 * 模块代号
	 */
    @Column()
    code: string;

	/**
	 * 模块权限
	 */
    @OneToMany(() => SystemRight, type => type.fromSystem, {
        cascade: ['insert', 'remove', 'update']
    })
    rights?: SystemRight[];
    @ResolveProperty()
    async getSystemRights(): Promise<SystemRight[]> {
        return [];
    }
	/**
	 * 模块事件
	 */
    @OneToMany(() => SystemEvent, type => type.fromSystem, {
        cascade: ['insert', 'remove', 'update']
    })
    events?: SystemEvent[];
    @ResolveProperty()
    async getSystemEvents(): Promise<SystemEvent[]> {
        return [];
    }
	/**
	 * 代办事项
	 */
    @OneToMany(() => ToDoItem, type => type.fromSystem)
    toDoItems?: ToDoItem[];
    @ResolveProperty()
    async getToDoItems(): Promise<ToDoItem[]> {
        return [];
    }
	/**
	 * 配置时间
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
}
