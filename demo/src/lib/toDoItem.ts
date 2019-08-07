import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinTable,
    Timestamp
} from 'typeorm';
import { System } from './system';
import { SystemEvent } from './systemEvent';
import { User } from './user';
const moment = require('moment');
@Entity()
export class ToDoItem {
	/**
	 * 编号
	 */
    @PrimaryGeneratedColumn()
    id?: number;

	/**
	 * 标题
	 */
    @Column()
    title: string;

	/**
	 * 简介
	 */
    @Column()
    desc: string;

	/**
	 * 创建时间
	 */
    @CreateDateColumn({
        type: 'timestamptz',
        transformer: {
            from: (date) => {
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            },
            to: (date) => {
                date = date ? date : new Date();
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    })
    createDate?: string;

	/**
	 * 来源模块
	 */
    @ManyToOne(() => System, type => type.toDoItems)
    @JoinTable({
        name: `fromSystemId`
    })
    fromSystem?: System;

    @Column({
        default: null
    })
    fromSystemId?: number;
	/**
	 * 来源事件
	 */
    @ManyToOne(() => SystemEvent, type => type.toDoItems)
    @JoinTable({
        name: `fromEventId`
    })
    fromEvent?: SystemEvent;

    @Column({
        default: null
    })
    fromEventId?: number;
	/**
	 * 申请人
	 */
    @ManyToOne(() => User, type => type.toDoItems)
    @JoinTable({
        name: `fromUserId`
    })
    fromUser?: User;

    @Column({
        default: null
    })
    fromUserId?: number;

	/**
	 * 处理人
	 */
    @ManyToOne(() => User, type => type.toDoItems)
    @JoinTable({
        name: `toUserId`
    })
    toUser?: User;

    @Column({
        default: null
    })
    toUserId: number;
}
