import { Resolver, Arg, Ctx, Query, Int } from "type-graphql";
import { EntityManager } from "@mikro-orm/postgresql";
import { PaginatedSurveys } from "./object-types";
import { MyContext } from "../types";
import { Survey } from "../entities/Survey";

@Resolver()
export class SurveyResolver {
  @Query(() => PaginatedSurveys)
  async surveys(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { em }: MyContext
  ): Promise<PaginatedSurveys> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const [surveys, count] = await (em as EntityManager).findAndCount(
      Survey,
      {},
      { limit: realLimit }
    );

    return {
      surveys: surveys,
      total: count,
      hasMore: surveys.length === reaLimitPlusOne,
    };
  }
}
