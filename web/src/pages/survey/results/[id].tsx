import React, { useState } from "react";
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
import { Result } from "../../../components/Result";
import { NavBar } from "../../../components/NavBar";
import {
  useMeQuery,
  useSurveyQuery,
  useQuestionsQuery,
  useSurveyResultsQuery,
} from "../../../generated/graphql";
import { jsonResultsToCsv } from "../../../utils/jsonToCsv";
import {
  fromResultList,
  groupResultsByGender,
} from "../../../utils/statsUtils";
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
  const [groupByGender, setGroupByGender] = useState(false);
  let survey = null;
  let surveyName: string | null = null;
  let surveyDesc = null;

  if (
    id &&
    q_response.data &&
    s_response.data?.survey.survey &&
    me_response.data &&
    s_results.data?.surveyResults.results
  ) {
    surveyName = s_response.data.survey.survey.name;
    surveyDesc = s_response.data.survey.survey.description;
    const resultsCsv = jsonResultsToCsv(
      fromResultList(s_results.data.surveyResults.results)
    );

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
          <Text>Agree</Text>
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
          {groupByGender
            ? groupResultsByGender(s_results.data.surveyResults.results).map(
                (gender, i) => {
                  let x = fromResultList(gender).map((r, j) => {
                    return (
                      <>
                        {j === 0 ? (
                          <>
                            <Box />
                            <Box />
                            <Box />
                            <Heading as="h3" fontSize="2xl">
                              {i === 0 ? "Male" : i === 1 ? "Female" : "Other"}
                            </Heading>
                            <Box />
                            <Box />
                            <Box />
                          </>
                        ) : null}
                        <Result
                          summaryStats={r.summaryStats}
                          question={r.question}
                          answerCount={r.answerCount}
                        />
                      </>
                    );
                  });
                  return x;
                }
              )
            : fromResultList(s_results.data.surveyResults.results).map((r) => {
                return (
                  <Result
                    summaryStats={r.summaryStats}
                    question={r.question}
                    answerCount={r.answerCount}
                  />
                );
              })}
        </SimpleGrid>
      );

      survey = (
        <>
          <Wrapper>
            <ThemeProvider theme={theme}>
              <CSSReset />
              <SimpleGrid columns={2}>
                <Heading>{surveyName}</Heading>
                <Button
                  maxW="200px"
                  onClick={() => setGroupByGender(!groupByGender)}
                >
                  {groupByGender ? "Don't Group" : "Group by Gender"}
                </Button>
                <Text fontSize="xl">{surveyDesc}</Text>
              </SimpleGrid>
              <Box mb="30px">{results}</Box>
              <Button
                onClick={() => {
                  downloadCsvFile(
                    resultsCsv,
                    surveyName?.replace(" ", "-") + "-results"
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
