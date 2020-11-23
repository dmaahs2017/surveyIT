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
import { Answer } from "./Answer";

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

  @OneToMany(() => Answer, (qa) => qa.question)
  answers!: Answer[];
}
