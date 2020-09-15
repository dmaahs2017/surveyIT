import {
  Resolver,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "../constants";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@InputType()
class RegisterInput {
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

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2",
          },
        ],
      };
    }
    let hasSpecialCharRegexp = new RegExp("[!@#\$%\^\&*\)\(+=._-]{1,}")
    if (!hasSpecialCharRegexp.test(options.password)) {
      return {
        errors: [
          {
            field: "password",
            message: "password must have at least 1 special character: '[!@#$%^&*)(+=._-]'",
          },
        ],
      };
    }

    let hasDigitsRegexp = new RegExp("[0-9]{1,}")
    if (!hasDigitsRegexp.test(options.password)) {
      return {
        errors: [
          {
            field: "password",
            message: "password must have at least 1 digit",
          },
        ],
      };
    }
    if (options.password.length <= 8) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be greater than 8",
          },
        ],
      };
    }

  let emailRegexp = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)");
    if (!emailRegexp.test(options.email)) {
      return {
        errors: [
          {
            field: "email",
            message: "email must be of from 'me@domain.com'",
          },
        ],
      };
    }

  let validUserTypes = ["SURVEYOR", "SURVEYEE"];
  if (!validUserTypes.includes(options.typeOfUser.toUpperCase())) {
      return {
        errors: [
          {
            field: "typeOfUser",
            message: "typeOfUser must be one of [" + validUserTypes + "]",
          },
        ],
      };
  }

  let phoneNumberRegexp = new RegExp("^[0-9]{10}$");
    if(!phoneNumberRegexp.test(options.phoneNumber)) {
      return {
        errors: [
          {
            field: "phoneNumber",
            message: "phoneNumber must be 10 digits",
          },
        ],
      };
    }


    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          email: options.email,
          phone_number: options.phoneNumber,
          type_of_user: options.typeOfUser.toUpperCase(),
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      user = result[0];
    } catch (err) {
      //|| err.detail.includes("already exists")) {
      // duplicate username error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "unkown",
              message: "a unique field is already taken",
            },
          ],
        };
      }
      else {
        return {
          errors: [
            {
              field: "unknown",
              message: "Failed inserting user"
            }
          ]
        }
      }
    }

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    //this is a weird thing with how the naming works. DB auto converts to snake case but graphql expects camelCase
    user.phoneNumber = user.phone_number;
    user.typeOfUser = user.type_of_user;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
