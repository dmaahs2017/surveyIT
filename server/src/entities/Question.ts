import {
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Survey } from "./Survey";
import { QuestionAnswer } from "./QuestionAnswer";

@ObjectType()
@Entity()
export class Question extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String)
  @Column()
  question!: string;

  @Field()
  @Column()
  surveyId!: number;

  @Field(() => Survey)
  @ManyToOne(() => Survey)
  survey!: Survey;

  @OneToMany(() => QuestionAnswer, (qa) => qa.question)
  answers!: QuestionAnswer[];
}
