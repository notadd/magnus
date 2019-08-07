import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Column,
	ManyToOne,
	OneToOne
} from 'typeorm';
import { SafetyScoreRule } from './safetyScoreRule';
import { User } from './user';
import { UserLoginLog } from './userLogin';
/**
 * 用户安全分扣除记录
 */
@Entity()
export class SafetyScoreLog {
	/**
	 * 编号
	 */
	@PrimaryGeneratedColumn()
	id?: number;

	/**
	 * 扣除分数
	 */
	@Column()
	score: number;

	/**
	 * 一个安全积分记录有一条用户登录日志
	 */
	@OneToOne(() => UserLoginLog, type => type.scoreLog)
	loginLog: UserLoginLog;

	/**
	 * 对应规则
	 */
	@ManyToOne(() => SafetyScoreRule, type => type.logs)
	rule: SafetyScoreRule;

	/**
	 * 用户
	 */
	@ManyToOne(() => User, type => type.safetyScoreLogs)
	user: User;

	/**
	 * 时间
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
