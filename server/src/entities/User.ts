import { OneToMany, BaseEntity, Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, Column } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Survey } from "./Survey";
import { QuestionAnswer } from "./QuestionAnswer";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({unique: true})
  username!: string;

  @Field()
  @Column({unique: true})
  email!: string;

  @Field()
  @Column({unique: true})
  phoneNumber!: string;

  @Field()
  @Column()
  typeOfUser!: string;

  @Column()
  password!: string;

  @OneToMany(() => Survey, (survey) => survey.creator)
  surveys: Survey[];

  @OneToMany(() => QuestionAnswer, (qa) => qa.user)
  answers: QuestionAnswer[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
