import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
import { Question } from "./Question"
import { User } from "./User"

@ObjectType()
@Entity()
export class QuestionAnswer {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => Question)
  @ManyToOne(() => Question)
  question!: Question;

  @Field()
  @Property()
  answer!: number;

  @ManyToOne(() => User)
  user!: User;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
