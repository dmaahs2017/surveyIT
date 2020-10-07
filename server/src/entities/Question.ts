import { OneToMany, Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
import { Survey } from "./Survey"
import {QuestionAnswer} from "./QuestionAnswer"

@ObjectType()
@Entity()
export class Question {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => String)
  @Property()
  question!: String;

  @ManyToOne(() => Survey)
  survey!: Survey;

  @OneToMany(() => QuestionAnswer, qa => qa.question)
  answers!: QuestionAnswer[];
}
