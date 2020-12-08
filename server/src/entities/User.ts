import {
  OneToMany,
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { Float, ObjectType, Field } from "type-graphql";
import { Survey } from "./Survey";
import { Answer } from "./Answer";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: "float", nullable: true })
  balance?: number;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({ unique: true })
  phoneNumber!: string;

  @Field(() => Float)
  @Column({ type: "float" })
  rewards!: number;

  @Field()
  @Column()
  typeOfUser!: string;

  @Field()
  @Column()
  gender!: string;

  @Field()
  @Column()
  income!: string;

  @Column()
  password!: string;

  @OneToMany(() => Survey, (survey) => survey.creator)
  surveys: Survey[];

  @ManyToMany(() => Survey, (survey) => survey.usersCompleted, {
    cascade: true,
  })
  @JoinTable({ name: "SurveysTaken" })
  surveysTaken: Survey[];

  @OneToMany(() => Answer, (qa) => qa.user)
  answers: Answer[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
