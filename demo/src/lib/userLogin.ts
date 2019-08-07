import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Column,
	ManyToOne,
	OneToOne
} from 'typeorm';
import { User } from './user';
import { SafetyScoreLog } from './safetyScoreLog';

/**
 * 用户登录日志表
 */
@Entity()
export class UserLoginLog {
	/**
	 * 日志编号
	 */
	@PrimaryGeneratedColumn()
	id?: number;

	@ManyToOne(() => User, type => type.loginLogs)
	user?: User;

	/**
	 * ip地址编号
	 */
	@Column()
	ip: string;

	/**
	 * 设备编号
	 */
	@Column()
	deviceId: string;

	/**
	 * 创建时间
	 */
	@CreateDateColumn()
	createDate?: number;

	/**
	 * 一条登录日志有一个扣分日志
	 */
	@OneToOne(() => SafetyScoreLog, type => type.loginLog)
	scoreLog: SafetyScoreLog;
}
