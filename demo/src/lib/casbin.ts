import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class CasbinRule extends BaseEntity {
    /**
     * 规则编号
     */
    @PrimaryGeneratedColumn()
    public id: number;

    /**
     * 类型
     */
    @Column({
        nullable: true
    })
    public ptype: string;

    /**
     * v0
     */
    @Column({
        nullable: true
    })
    public v0: string;

    /**
     * v1
     */
    @Column({
        nullable: true
    })
    public v1: string;

    /**
     * v2
     */
    @Column({
        nullable: true
    })
    public v2: string;

    /**
     * v3
     */
    @Column({
        nullable: true
    })
    public v3: string;

    /**
     * v4
     */
    @Column({
        nullable: true
    })
    public v4: string;

    /**
     * v5
     */
    @Column({
        nullable: true
    })
    public v5: string;
}