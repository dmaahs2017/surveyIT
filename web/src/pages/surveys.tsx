import React from "react";
import { useSurveysQuery, useQuestionsQuery } from "../generated/graphql";
import { SurveyTemplate } from "../components/survey";
import { Text } from "@chakra-ui/core";

const Surveys = () => {
  const [{ data }] = useSurveysQuery({
    variables: {
      offset: 0,
      limit: 10,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (data) {
    return data.surveys.surveys.map((s) =>
      SurveyTemplate(s.name, s.description)
    );
  }
  return <Text>FUCK ME</Text>;
};

export default Surveys;
