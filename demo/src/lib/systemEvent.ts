import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { ToDoItem } from './toDoItem';
import { System } from './system';
import { ResolveProperty } from '@notadd/magnus-core';
/**
 * 模块事件类型
 */
@Entity()
export class SystemEvent {
    @PrimaryGeneratedColumn()
    id?: number;
	/**
	 * 权限名
	 */
    @Column()
    title: string;
	/**
	 * 来源模块
	 */
    @ManyToOne(() => System, type => type.rights)
    fromSystem?: System;

	/**
	 * 代办事项
	 */
    @OneToMany(() => ToDoItem, type => type.fromEvent, {
        cascade: ['insert', 'remove', 'update']
    })
    toDoItems?: ToDoItem[];
    @ResolveProperty()
    async getToDoItems(): Promise<ToDoItem[]> {
        return [];
    }
}
