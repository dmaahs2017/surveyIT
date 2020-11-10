import React from "react";
import { NextPage } from "next";
import {
  ThemeProvider,
  CSSReset,
  theme,
  Heading,
  Text,
  Box,
} from "@chakra-ui/core";
import { Wrapper } from "../../../components/Wrapper";
import { NavBar } from "../../../components/NavBar";
import {
  useMeQuery,
  useSurveyQuery,
  useQuestionsQuery,
  useSurveyResultsQuery,
} from "../../../generated/graphql";
import { answerToString } from "../../../utils/answerToString";

const Survey: NextPage<{ id: number }> = ({ id }) => {
  const [q_response] = useQuestionsQuery({
    variables: {
      offset: 0,
      limit: 10,
      survey_id: id,
    },
  });
  const [s_response] = useSurveyQuery({
    variables: {
      survey_id: id,
    },
  });
  const [s_results] = useSurveyResultsQuery({
    variables: {
      survey_id: id,
    },
  });
  const [me_response] = useMeQuery();
  let survey = null;
  let surveyName = null;
  let surveyDesc = null;

  if (
    id &&
    q_response.data &&
    s_response.data?.survey.survey &&
    me_response.data &&
    s_results.data
  ) {
    surveyName = s_response.data.survey.survey.name;
    surveyDesc = s_response.data.survey.survey.description;

    //if not creator of survey
    if (s_response.data.survey.survey.creator.id != me_response.data.me?.id) {
      survey = (
        <Wrapper>
          <ThemeProvider theme={theme}>
            <CSSReset />
            <Heading>Unauthorized to view survey results</Heading>
          </ThemeProvider>
        </Wrapper>
      );
    } else {
      //else creator of survey
      const results = s_results.data.surveyResults.results?.map((r) => (
        <>
          <Text fontWeight="bold">{r.question}</Text>
          {r.answerCount.map((n, i) => (
            <>
              <Text display="inline" fontStyle="italic">
                {answerToString(i)}
              </Text>
              <Text display="inline" fontWeight="semibold" mr="3">
                : {n}
              </Text>
            </>
          ))}
          <Text display="inline" fontStyle="italic">
            Total Responses
          </Text>
          <Text display="inline" fontWeight="semibold">
            : {r.answerCount.reduce((a, b) => a + b)}
          </Text>
        </>
      ));

      survey = (
        <>
          <Wrapper>
            <ThemeProvider theme={theme}>
              <CSSReset />
              <Heading>{surveyName}</Heading>
              <Text fontSize="xl">{surveyDesc}</Text>
              <Box>{results}</Box>
            </ThemeProvider>
          </Wrapper>
        </>
      );
    }
  } else {
    survey = <Text>Failed</Text>;
  }

  return (
    <>
      <NavBar />
      {survey}
    </>
  );
};

Survey.getInitialProps = ({ query }) => {
  return {
    id: parseInt(query.id as string),
  };
};
export default Survey;
