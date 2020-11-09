import { registerEnumType } from "type-graphql";
import { SurveyState } from "../../shared/enums";

export const registerEnumsWithGraphql = () => {
  registerEnumType(SurveyState, {
    name: "SurveyState",
    description: "The active state of the survey",
  });
};
