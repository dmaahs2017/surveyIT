import { Resolver, Arg, Ctx, Query, Int, Mutation } from "type-graphql";
import { PaginatedSurveys } from "./object-types";
import { MyContext } from "../types";
import { Survey } from "../entities/Survey";
import { SurveyInput } from "./input-types";
import { SurveyResponse } from "./object-types";
import { v4 } from "uuid";
import { getConnection } from "typeorm";

@Resolver()
export class SurveyResolver {
  @Mutation(() => Survey)
  async createSurvey(
    @Arg("input") input: SurveyInput,
    @Ctx() { req }: MyContext
  ) {
    return Survey.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Query(() => PaginatedSurveys)
  async surveys(
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number
  ): Promise<PaginatedSurveys> {
    const [surveys, count] = await getConnection()
      .getRepository(Survey)
      .createQueryBuilder("s")
      .innerJoinAndSelect("s.creator", "user", 'user.id = s."creatorId"')
      .orderBy("s.createdAt", "DESC")
      .take(limit)
      .offset(offset)
      .getManyAndCount();

    return {
      surveys: surveys,
      total: count,
      hasMore: count - (offset + limit) > 0,
      id: v4(),
    };
  }

  @Query(() => SurveyResponse)
  async survey(
    @Arg("survey_id", () => Int) survey_id: number
  ): Promise<SurveyResponse> {
    const survey = await Survey.findOne(survey_id);
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
