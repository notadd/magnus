import { Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, Column } from 'typeorm';
import { SafetyScoreLog } from './safetyScoreLog';
import { ResolveProperty } from '@notadd/magnus-core';

@Entity()
export class SafetyScoreRule {
    @PrimaryGeneratedColumn()
    id?: number;

	/**
	 * 规则名
	 */
    @Column()
    title: string;

	/**
	 * 代号
	 */
    @Column()
    code: string;

	/**
	 * 分值
	 */
    @Column()
    score: number;

	/**
	 * 是否替换
	 */
    @Column({
        default: false
    })
    isReplace?: boolean;

	/**
	 * 记录
	 */
    @OneToMany(() => SafetyScoreLog, type => type.rule)
    logs?: SafetyScoreLog[];
    @ResolveProperty()
    async getSafetyScoreLogs(): Promise<SafetyScoreLog[]> {
        return [];
    }
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
