import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql";
import {getConnection} from "typeorm"
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { FORGET_PASSWORD_PREFIX, COOKIE_NAME } from "../constants";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { UserResponse } from "./object-types";
import { RegisterInput, UsernamePasswordInput } from "./input-types";

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = await User.findOne(req.session.userId);
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let hasSpecialCharRegexp = new RegExp("[!@#$%^&*)(+=._-]{1,}");
    if (!hasSpecialCharRegexp.test(options.password)) {
      return {
        errors: [
          {
            field: "password",
            message:
              "password must have at least 1 special character: '[!@#$%^&*)(+=._-]'",
          },
        ],
      };
    }

    let hasDigitsRegexp = new RegExp("[0-9]{1,}");
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

    let emailRegexp = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)"
    );
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
    if (!phoneNumberRegexp.test(options.phoneNumber)) {
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
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          phoneNumber: options.phoneNumber,
          typeOfUser: options.typeOfUser.toUpperCase(),
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
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
      } else {
        return {
          errors: [
            {
              field: "unknown",
              message: "Failed inserting user",
            },
          ],
        };
      }
    }

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    //validate password
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
    
    const userIdNum = parseInt(userId)

    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    await User.update({ id: userIdNum }, { password: await argon2.hash(newPassword) })
    await redis.del(key);
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({where: { email }});
    if (!user) {
      //no email in the db
      console.log("FAILED");
      return true;
    }

    const token = v4();

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days
    return true;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({where: {username: options.username}});
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
