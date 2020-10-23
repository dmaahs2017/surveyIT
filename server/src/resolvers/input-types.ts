import { InputType, Field } from "type-graphql";

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
  @Field()
  description?: string;
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
