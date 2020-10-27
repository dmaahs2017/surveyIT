import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Question } from "./Question";
import { User } from "./User";

@ObjectType()
@Entity()
export class Answer extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  answer!: number;

  @Field()
  @Column()
  questionId!: number;

  @Field(() => Question)
  @ManyToOne(() => Question)
  question!: Question;

  @Field()
  @Column()
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();
}
