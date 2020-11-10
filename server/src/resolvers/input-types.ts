import { Int, InputType, Field } from "type-graphql";

@InputType()
export class AnswerInput {
  @Field(() => Int)
  questionId: number;
  @Field(() => Int)
  answer: number;
}

@InputType()
export class SurveySubmission {
  @Field(() => Int)
  surveyId: number;
  @Field(() => [AnswerInput])
  answers: [AnswerInput];
}

@InputType()
export class UpdateUserInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  phoneNumber: string;
}

@InputType()
export class SurveyInput {
  @Field()
  name!: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  closesAt?: Date;
  @Field({ nullable: true })
  opensAt?: Date;
}

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
  @Field()
  phoneNumber: string;
  @Field()
  typeOfUser: string;
}
