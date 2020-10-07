import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";
import { Survey } from "./entities/Survey"
import {Question} from "./entities/Question"
import {QuestionAnswer} from "./entities/QuestionAnswer"

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [User, Survey, Question, QuestionAnswer],
  dbName: "surveyIT",
  type: "postgresql",
  user: "postgres",
  password: "postgres",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
