import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql";
import { getConnection } from "typeorm";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { FORGET_PASSWORD_PREFIX, COOKIE_NAME } from "../constants";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { UserResponse } from "./object-types";
import luhn from "luhn";
import {
  BankPaymentInfo,
  UpdateUserInput,
  RegisterInput,
  UsernamePasswordInput,
} from "./input-types";

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

    if (options.typeOfUser.toUpperCase() === "SURVEYEE") {
      if (
        ["MALE", "FEMALE", "OTHER"].find(
          (e) => options.gender.toUpperCase() === e
        ) === undefined
      ) {
        return {
          errors: [
            {
              field: "gender",
              message: "gender must be MALE | FEMALE | OTHER",
            },
          ],
        };
      }

      if (options.income === "") {
        return {
          errors: [
            {
              field: "income",
              message: "income must not be blank",
            },
          ],
        };
      }
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
          gender: options.gender.toUpperCase(),
          income: options.income,
          typeOfUser: options.typeOfUser.toUpperCase(),
          password: hashedPassword,
          rewards: 0,
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
              field: "unknown",
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
  async payBalance(
    @Ctx() { req }: MyContext,
    @Arg("payInFull") payInFull: boolean,
    @Arg("amount", { nullable: true }) amount?: number,
    @Arg("creditCard", { nullable: true }) creditCard?: string,
    @Arg("bankPaymentInfo", { nullable: true })
    bankPaymentInfo?: BankPaymentInfo
  ): Promise<UserResponse> {
    let user = await User.findOneOrFail(req.session.userId);

    //inverse XOR, one must be provided
    if (
      !((creditCard && !bankPaymentInfo) || (!creditCard && bankPaymentInfo))
    ) {
      return {
        errors: [
          {
            field: "creditCard",
            message: "please select one payment option",
          },
          {
            field: "bankPaymentInfo",
            message: "please select one payment option",
          },
        ],
      };
    }

    if (creditCard) {
      //validate card
      if (!luhn.validate(creditCard)) {
        return {
          errors: [
            {
              field: "creditCard",
              message: "invalid credit card",
            },
          ],
        };
      }
      //charge card
    }

    if (bankPaymentInfo) {
      const isNum = (val: string) => /^\d+$/.test(val);
      //validate rn
      if (
        bankPaymentInfo.routingNumber.length !== 9 ||
        !isNum(bankPaymentInfo.routingNumber)
      ) {
        return {
          errors: [
            {
              field: "routingNumber",
              message: "invalid routing number",
            },
          ],
        };
      }

      //validate an
      if (
        !(
          bankPaymentInfo.accountNumber.length >= 10 &&
          bankPaymentInfo.accountNumber.length <= 12
        ) ||
        !isNum(bankPaymentInfo.accountNumber)
      ) {
        return {
          errors: [
            {
              field: "accountNumber",
              message: "invalid account number",
            },
          ],
        };
      }
      //charge bank acct
    }

    if (payInFull) {
      user.balance = 0;
    } else if (amount === undefined) {
      return {
        errors: [
          {
            field: "amount",
            message: "amount is empty and payInFull is false",
          },
        ],
      };
    } else if (user.balance) {
      user.balance -= amount;
      if (user.balance < 0) {
        user.balance = 0;
      }
    }

    user.save();

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

    const userIdNum = parseInt(userId);

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

    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );
    await redis.del(key);
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
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
    const user = await User.findOne({ where: { username: options.username } });
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

  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("input") input: UpdateUserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const userId = req.session.userId;
    if (!userId) {
      return {
        errors: [
          {
            field: "N/a",
            message: "not logged in, can't update user",
          },
        ],
      };
    }

    const user = await User.findOne(userId);
    if (!user) {
      return {
        errors: [
          {
            field: "id",
            message: "User does not exist",
          },
        ],
      };
    }

    user.email = input.email;
    user.phoneNumber = input.phoneNumber;
    user.username = input.username;
    user.gender = input.gender;
    user.income = input.income;

    try {
      const updatedUser = await user.save();
      return { user: updatedUser };
    } catch (err) {
      return {
        errors: [
          {
            field: "input",
            message: err.detail,
          },
        ],
      };
    }
  }
}
