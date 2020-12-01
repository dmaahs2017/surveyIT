import { Float, Field, ObjectType } from "type-graphql";
import { User } from "../entities/User";
import { Survey } from "../entities/Survey";
import { Question } from "../entities/Question";

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
export class SummaryStatistics {
  @Field(() => Float)
  mean: number;
  @Field(() => Float)
  median: number;
  @Field(() => Float)
  mode: number;
}

@ObjectType()
export class Result {
  @Field()
  question: string;
  @Field()
  answer: number;
  @Field()
  userId: number;
  @Field()
  userIncome: string;
  @Field()
  userGender: string;
}

@ObjectType()
export class SurveyResults {
  @Field(() => [Result], { nullable: true })
  results?: Result[];

  @Field(() => FieldError, { nullable: true })
  errors?: FieldError[];
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class SurveyResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Survey, { nullable: true })
  survey?: Survey;
}

@ObjectType()
export class PaginatedSurveys {
  @Field(() => [Survey], { nullable: true })
  surveys?: Survey[];
  @Field()
  total: number;
  @Field()
  hasMore: boolean;
  @Field()
  id: string;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@ObjectType()
export class PaginatedQuestions {
  @Field(() => [Question])
  questions: Question[];

  @Field()
  total: number;

  @Field()
  hasMore: boolean;
}
