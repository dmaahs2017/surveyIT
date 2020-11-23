import { Resolver, Arg, Ctx, Query, Int, Mutation } from "type-graphql";
import { FieldError, PaginatedSurveys } from "./object-types";
import { MyContext } from "../types";
import { Survey } from "../entities/Survey";
import { Answer } from "../entities/Answer";
import { Question } from "../entities/Question";
import { SurveySubmission, SurveyInput } from "./input-types";
import {
  SummaryStatistics,
  SurveyResponse,
  SurveyResults,
} from "./object-types";
import { v4 } from "uuid";
import { getConnection } from "typeorm";
import { summaryStatistics } from "../utils/summaryStatistics";

@Resolver()
export class SurveyResolver {
  @Mutation(() => Survey)
  async createSurvey(
    @Arg("input") input: SurveyInput,
    @Ctx() { req }: MyContext
  ): Promise<Survey> {
    const obfuscationRate = 1.8;
    return Survey.create({
      ...input,
      availablePoints: input.allocatedMoney * obfuscationRate,
      rewardsRate:
        (input.allocatedMoney * obfuscationRate) / input.numGuarenteedResponses,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => SurveyResponse)
  async closeSurvey(
    @Arg("surveyId", () => Int) surveyId: number,
    @Ctx() { req }: MyContext,
    @Arg("closeAt", { nullable: true }) closeAt?: Date
  ): Promise<SurveyResponse> {
    const userId = req.session.userId;
    if (!userId) {
      return {
        errors: [
          {
            field: "userId",
            message: "Not Logged In",
          },
        ],
      };
    }

    let survey = await Survey.findOne({
      where: { id: surveyId, creatorId: userId },
    });

    if (!survey) {
      return {
        errors: [
          {
            field: "surveyId or creatorId",
            message: "You do not own this survey",
          },
        ],
      };
    }

    const now = new Date();
    if (survey.closesAt && survey.closesAt < now && !closeAt) {
      return {
        errors: [
          {
            field: "closesAt",
            message: "Survey already closed",
          },
        ],
      };
    } else if (closeAt && closeAt < now) {
      return {
        errors: [
          {
            field: "closeAt",
            message:
              "Cannot schedule a survey to close in the past. Must schedule a future date and time",
          },
        ],
      };
    }

    if (closeAt) {
      survey.closesAt = closeAt;
    } else {
      survey.closesAt = now;
    }

    try {
      survey.save();
    } catch (e) {
      return {
        errors: [
          {
            field: "surveyId or creatorId",
            message: e,
          },
        ],
      };
    }
    return { survey };
  }

  @Mutation(() => SurveyResponse)
  async openSurvey(
    @Arg("surveyId", () => Int) surveyId: number,
    @Ctx() { req }: MyContext,
    @Arg("openAt", { nullable: true }) openAt?: Date
  ): Promise<SurveyResponse> {
    const userId = req.session.userId;
    if (!userId) {
      return {
        errors: [
          {
            field: "userId",
            message: "Not Logged In",
          },
        ],
      };
    }

    let survey = await Survey.findOne({
      where: { id: surveyId, creatorId: userId },
    });

    if (!survey) {
      return {
        errors: [
          {
            field: "surveyId or creatorId",
            message: "You do not own this survey",
          },
        ],
      };
    }

    const now = new Date();
    if (openAt) {
      if (openAt < now) {
        return {
          errors: [
            {
              field: "openAt",
              message:
                "Cannot schedule a survey to open in the past. Must schedule a future date and time",
            },
          ],
        };
      }

      survey.opensAt = openAt;
    } else {
      //otherwise using the current date
      if (survey.opensAt) {
        if (survey.opensAt < now) {
          return {
            errors: [
              {
                field: "opensAt",
                message: "Survey already opened",
              },
            ],
          };
        }
      }
      survey.opensAt = openAt;
    }

    if (survey.opensAt && survey.closesAt) {
      if (survey.opensAt > survey.closesAt) {
        return {
          errors: [
            {
              field: "opensAt",
              message:
                "Cannot schedule a survey to open after it's sceduled close date",
            },
          ],
        };
      }
    }

    if (openAt) {
      survey.opensAt = openAt;
    } else {
      survey.opensAt = now;
    }

    try {
      survey.save();
    } catch (e) {
      return {
        errors: [
          {
            field: "surveyId or creatorId",
            message: e,
          },
        ],
      };
    }
    return { survey };
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

    if (errors.length === 0) {
      //then submission is successful and give the user pts
      //TODO
    }

    return errors;
  }

  //This function is utter garbage but it works :)
  @Query(() => SurveyResults)
  async surveyResults(
    @Arg("survey_id", () => Int) survey_id: number
  ): Promise<SurveyResults> {
    let response = await getConnection()
      .getRepository(Answer)
      .createQueryBuilder("a")
      .innerJoin("a.question", "question", 'question.id = a."questionId"')
      .innerJoin("question.survey", "survey", 'survey.id = question."surveyId"')
      .where(`survey.id = ${survey_id}`)
      .select(["question.question", "a.answer", "question.id"])
      .getRawMany();

    let response2 = response.map((s) => {
      return {
        answer: s.a_answer,
        question: s.question_question,
        questionId: s.question_id,
      };
    });

    let qids: {
      qid: number;
      question: string;
      answerCount: number[];
      summaryStats: SummaryStatistics;
    }[] = [];

    response2.map((x) => {
      if (
        !qids.find((n) => {
          return n.qid === x.questionId;
        })
      ) {
        qids.push({
          qid: x.questionId,
          question: x.question,
          answerCount: new Array(5),
          summaryStats: { mean: -1, median: -1, mode: -1 },
        });
      }
    });

    qids.map((qi) => {
      qi.answerCount = [0, 0, 0, 0, 0];
      response2.map((x) => {
        if (qi.qid == x.questionId) {
          qi.answerCount[x.answer] += 1;
        }
        qi.summaryStats = summaryStatistics(qi.answerCount);
      });
    });

    return { results: qids };
  }

  @Mutation(() => [FieldError])
  async deleteSurvey(
    @Arg("surveyId", () => Int) surveyId: number,
    @Ctx() { req }: MyContext
  ): Promise<FieldError[]> {
    const userId = req.session.userId;
    if (!userId) {
      return [
        {
          field: "userId",
          message: "not logged in",
        },
      ];
    }

    let survey = await Survey.findOne({
      where: { id: surveyId, creatorId: userId },
    });

    if (userId != survey?.creatorId) {
      return [
        {
          field: "userId",
          message: "Not authorized to delete this survey",
        },
      ];
    }

    let questions = await Question.find({ where: { surveyId } });

    //delte all answers for each question
    questions.map((q) => {
      Answer.delete({ questionId: q.id });
    });

    //delete all questions
    Question.remove(questions);

    //delete the survey
    if (survey) {
      survey.remove();
      return [];
    }

    return [
      {
        field: "n/a",
        message: "Nothing Removed",
      },
    ];
  }
}
