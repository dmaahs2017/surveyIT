import { OneToMany, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
import { Survey } from "./Survey";
import { QuestionAnswer } from "./QuestionAnswer";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  @Field()
  @Property({ type: "text", unique: true })
  email!: string;

  @Field()
  @Property({ type: "text", unique: true })
  phoneNumber!: string;

  @Field()
  @Property({ type: "text" })
  typeOfUser!: string;

  @Property({ type: "text" })
  password!: string;

  @OneToMany(() => Survey, (survey) => survey.creator)
  surveys: Survey[];

  @OneToMany(() => QuestionAnswer, (qa) => qa.user)
  answers: QuestionAnswer[];

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
