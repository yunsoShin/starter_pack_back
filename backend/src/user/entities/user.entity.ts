import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity("users") // 테이블 이름을 'users'로 정의
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: "user" })
  role: string; // 사용자의 역할 (예: 'admin', 'user')

  @CreateDateColumn({ name: "created_at", comment: "생성날짜" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", comment: "수정날짜" })
  updatedAt: Date;
}
