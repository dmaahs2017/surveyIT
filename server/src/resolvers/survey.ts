import { Resolver, Arg, Ctx, Query, Int, Mutation } from "type-graphql";
import { EntityManager } from "@mikro-orm/postgresql";
import { PaginatedSurveys } from "./object-types";
import { MyContext } from "../types";
import { Survey } from "../entities/Survey";
import { SurveyInput } from "./input-types";
import { SurveyResponse } from "./object-types";
import { v4 } from "uuid";

@Resolver()
export class SurveyResolver {
  @Mutation(() => Survey)
  async createSurvey(
    @Arg("options") options: SurveyInput,
    @Ctx() { em }: MyContext
  ) {
    let survey;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(Survey)
        .getKnexQuery()
        .insert({
          name: options.name,
          description: options.description ? options.description : null,
          creator_id: options.creator_id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      survey = result[0];
    } catch (err) {
      console.log(err);
    }

    return survey;
  }

  @Query(() => PaginatedSurveys)
  async surveys(
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number,
    @Ctx() { em }: MyContext
  ): Promise<PaginatedSurveys> {
    const [surveys, count] = await (em as EntityManager).findAndCount(
      Survey,
      {},
      { limit: limit, offset: offset }
    );

    return {
      surveys: surveys,
      total: count,
      hasMore: count - (offset + limit) > 0,
      id: v4(),
    };
  }

  @Query(() => SurveyResponse)
  async survey(
    @Arg("survey_id", () => Int) survey_id: number,
    @Ctx() { em }: MyContext
  ): Promise<SurveyResponse> {
    const survey = await (em as EntityManager).findOne(Survey, {id: survey_id})
    if (!survey) {
      return {
        errors: [
          {
            field: "username",
            message: "that username doesn't exist",
          },
        ],
      };
    }

    return {
      survey,
    };
  }
}
