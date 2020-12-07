import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Float, ObjectType, Field } from "type-graphql";
import { Question } from "./Question";
import { User } from "./User";

@ObjectType()
@Entity()
export class Survey extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  opensAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  closesAt?: Date;

  @Field(() => Float)
  @Column({ type: "float" })
  availablePoints!: number;

  @Field(() => Float)
  @Column({ type: "float" })
  rewardsRate!: number;

  @Field()
  @Column()
  creatorId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.surveys)
  creator: User;

  @OneToMany(() => Question, (question) => question.survey)
  questions: Question[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
