import { Resolver, Arg, Ctx, Query, Int, Mutation } from "type-graphql";
import { FieldError, PaginatedSurveys } from "./object-types";
import { MyContext } from "../types";
import { Survey } from "../entities/Survey";
import { Answer } from "../entities/Answer";
import { SurveySubmission, SurveyInput } from "./input-types";
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
  async meSurveys(
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedSurveys> {
    let userId = req.session.userId;
    if (!userId) {
      return {
        hasMore: false,
        total: 0,
        id: v4(),
        errors: [
          {
            field: "n/A",
            message: "Log in to view your surveys",
          },
        ],
      };
    }

    const [surveys, count] = await getConnection()
      .getRepository(Survey)
      .createQueryBuilder("s")
      .innerJoinAndSelect("s.creator", "user", 'user.id = s."creatorId"')
      .where(`s.creatorId = ${userId}`)
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
    const survey = await getConnection()
      .getRepository(Survey)
      .createQueryBuilder("s")
      .innerJoinAndSelect("s.creator", "user", 'user.id = s."creatorId"')
      .where(`s.id = ${survey_id}`)
      .getOne();

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

  @Mutation(() => [FieldError])
  async submitSurvey(
    @Arg("submission", () => SurveySubmission) submission: SurveySubmission,
    @Ctx() { req }: MyContext
  ): Promise<FieldError[]> {
    if (!submission) {
      return [
        {
          field: "submission",
          message: "submission is empty",
        },
      ];
    }

    const userId = req.session.userId;
    if (!userId) {
      return [
        {
          field: "userId",
          message: "not logged in",
        },
      ];
    }

    let errors: FieldError[] = [];
    for (let i = 0; i < submission.answers.length; i++) {
      let answer = new Answer();
      answer.questionId = submission.answers[i].questionId;
      answer.userId = userId;
      answer.answer = submission.answers[i].answer;

      let existsingResponse = await Answer.findOne({
        where: { questionId: answer.questionId, userId: userId },
      });
      if (existsingResponse) {
        errors.push({
          field: `questionId: ${answer.questionId}`,
          message: "This user has already responded to this question",
        });
      } else if (answer.answer < 0 || answer.answer > 4) {
        errors.push({
          field: `questionId: ${answer.questionId}`,
          message: "Answer must be between [0, 4]",
        });
      } else {
        try {
          answer.save();
        } catch (err) {
          errors.push({
            field: `questionId: ${answer.questionId}`,
            message: err.message,
          });
        }
      }
    }

    return errors;
  }
}
