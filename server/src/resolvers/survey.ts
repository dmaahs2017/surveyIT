import { Resolver, Arg, Ctx, Query, Int, Mutation } from "type-graphql";
import { EntityManager } from "@mikro-orm/postgresql";
import { PaginatedSurveys } from "./object-types";
import { MyContext } from "../types";
import { Survey } from "../entities/Survey";
import { SurveyInput } from "./input-types";

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

    console.log("=========== DBG ==============");
    console.log(survey);
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
    };
  }
}
