// src/entity/user.ts
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column()
  email: string;
  
  @CreateDateColumn({ comment: '创建时间' })  // 自动生成列
  create_time: string

  @UpdateDateColumn({ comment: '更新时间' })   // 自动生成并自动更新列
  update_time: string
}
