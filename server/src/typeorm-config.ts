import { __prod__ } from "./constants";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Survey } from "./entities/Survey";
import { Question } from "./entities/Question";
import { Answer } from "./entities/Answer";

export default {
  type: "postgres",
  database: "surveyIT",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true,
  entities: [User, Survey, Question, Answer],
} as Parameters<typeof createConnection>[0];
