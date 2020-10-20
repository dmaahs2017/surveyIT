import { Query, Resolver, Arg, Int, Mutation } from "type-graphql";
import { getConnection } from "typeorm";
import { Question } from "../entities/Question";
import { PaginatedQuestions } from "./object-types";

@Resolver()
export class QuestionResolver {
  @Mutation(() => Question)
  async createQuestion(
    @Arg("q_str", () => String) q_str: string,
    @Arg("survey_id", () => Int) survey_id: number
  ) {
    let question;
    try {
      let result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Question)
        .values({
          question: q_str,
          surveyId: survey_id,
        })
        .returning("*")
        .execute();
      question = result.raw[0];
    } catch (err) {
      console.log(err);
    }

    return question;
  }

  @Query(() => PaginatedQuestions)
  async questions(
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int) offset: number,
    @Arg("survey_id", () => Int, { nullable: true }) survey_id: number | null
  ): Promise<PaginatedQuestions> {
    let questions, count;
    if (survey_id) {
      [questions, count] = await Question.findAndCount({
        where: { id: survey_id },
        take: limit,
        skip: offset,
      });
    } else {
      [questions, count] = await Question.findAndCount({
        take: limit,
        skip: offset,
      });
    }

    return {
      questions: questions,
      total: count,
      hasMore: count - (offset + limit) > 0,
    };
  }
}
