import { Query, Resolver, Arg, Ctx, Int, Mutation } from "type-graphql";
import { Question } from "../entities/Question";
import { PaginatedQuestions } from "./object-types";
import { MyContext } from "../types";
import { EntityManager } from "@mikro-orm/postgresql";

@Resolver()
export class QuestionResolver {
  @Mutation(() => Question)
  async createQuestion(
    @Arg("q_str", () => String) q_str: string,
    @Arg("survey_id", () => Int) survey_id: number,
    @Ctx() { em }: MyContext
  ) {
    let question;
    try {
      let result = await (em as EntityManager)
        .createQueryBuilder(Question)
        .getKnexQuery()
        .insert({
          question: q_str,
          survey_id: survey_id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      question = result[0];
    } catch (err) {
      console.log(err);
    }

    return question;
  }

  @Query(() => PaginatedQuestions)
  async questions(
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int) offset: number,
    @Arg("survey_id", () => Int, { nullable: true }) survey_id: number | null,
    @Ctx() { em }: MyContext
  ): Promise<PaginatedQuestions> {
    let questions, count;
    if (survey_id) {
      [questions, count] = await (em as EntityManager).findAndCount(
        Question,
        { survey: { id: survey_id } },
        { limit: limit, offset: offset }
      );
    } else {
      [questions, count] = await (em as EntityManager).findAndCount(
        Question,
        {},
        { limit: limit, offset: offset }
      );
    }

    return {
      questions: questions,
      total: count,
      hasMore: count - (offset + limit) > 0,
    };
  }
}
