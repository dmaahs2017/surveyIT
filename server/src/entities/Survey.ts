import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
} from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
import { Question } from "./Question";
import { User } from "./User";

@ObjectType()
@Entity()
export class Survey {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property()
  name!: String;

  @Field(() => String)
  @Property()
  description: String;

  @Field(() => User)
  @ManyToOne(() => User)
  creator!: User;

  @OneToMany(() => Question, (question) => question.survey)
  questions: Question[];

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
