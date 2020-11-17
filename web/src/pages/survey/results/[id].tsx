import React from "react";
import { NextPage } from "next";
import {
  ThemeProvider,
  CSSReset,
  Button,
  Tooltip,
  theme,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  Box,
} from "@chakra-ui/core";
import { QuestionIcon } from "@chakra-ui/icons";
import { Wrapper } from "../../../components/Wrapper";
import { NavBar } from "../../../components/NavBar";
import {
  useMeQuery,
  useSurveyQuery,
  useQuestionsQuery,
  useSurveyResultsQuery,
} from "../../../generated/graphql";
import { answerToString } from "../../../utils/answerToString";
import { jsonResultsToCsv } from "../../../utils/jsonToCsv";
import { downloadCsvFile } from "../../../utils/downloads";

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
    const resultsCsv = jsonResultsToCsv(s_results.data.surveyResults.results);

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
      const results = (
        <SimpleGrid columns={7} justifyItems="center">
          <Text fontStyle="underline" mb="15px">
            Question
          </Text>
          <Text>Strongly Disagree</Text>
          <Text>Disagree</Text>
          <Text>Neutral</Text>
          <Text>Disagree</Text>
          <Text>Strongly Agree</Text>
          <Flex>
            <Text>Summary Stats</Text>
            <Tooltip
              label="The labels 'Strongly Disagree' to 'Strongly Agree' are represented as integers 0-4 resepectively. These are then used to calculate the summary statistics"
              aria-label="The labels 'Strongly Disagree' to 'Strongly Agree' are represented as integers 0-4 resepectively. These are then used to calculate the summary statistics"
            >
              <QuestionIcon w={3} h={3} />
            </Tooltip>
          </Flex>

          {s_results.data.surveyResults.results.map((r) => (
            <>
              <Text fontWeight="bold" mr="3px">
                {r.question}:
              </Text>
              {r.answerCount.map((n) => (
                <Text fontWeight="semibold" mr="3">
                  {n}
                </Text>
              ))}

              <SimpleGrid columns={3} mb="20px">
                <Text mr="3" fontStyle="italic" textDecor="underline">
                  Mean
                </Text>
                <Text mr="3" fontStyle="italic" textDecor="underline">
                  Median
                </Text>
                <Text mr="3" fontStyle="italic" textDecor="underline">
                  Mode
                </Text>

                <Text>{r.summaryStats.mean}</Text>
                <Text>{r.summaryStats.median}</Text>
                <Text>{r.summaryStats.mode}</Text>
              </SimpleGrid>
            </>
          ))}
        </SimpleGrid>
      );

      survey = (
        <>
          <Wrapper>
            <ThemeProvider theme={theme}>
              <CSSReset />
              <Heading>{surveyName}</Heading>
              <Text fontSize="xl">{surveyDesc}</Text>
              <Box mb="30px">{results}</Box>
              <Button
                onClick={() => {
                  downloadCsvFile(
                    resultsCsv,
                    surveyName.replace(" ", "-") + "-results"
                  );
                }}
              >
                Download Results as CSV
              </Button>
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
