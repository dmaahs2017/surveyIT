import React from "react";
import { NextPage } from "next";
import {
  ThemeProvider,
  CSSReset,
  theme,
  Heading,
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/core";
import { Wrapper } from "../../components/Wrapper";
import { useSurveyQuery, useQuestionsQuery } from "../../generated/graphql";

const Survey: NextPage<{ token: number }> = ({ token }) => {
  const [q_response] = useQuestionsQuery({
    variables: {
      offset: 0,
      limit: 10,
      survey_id: token,
    },
    notifyOnNetworkStatusChange: true,
  });
  const [s_response] = useSurveyQuery({
    variables: {
      survey_id: token
    }
  });


  if (token && q_response.data && s_response.data) {
    const questions = q_response.data.questions.questions.map((q) => (
      <>
        <FormLabel>{q.question}</FormLabel>
        <Input />
        <FormHelperText>Helper Text</FormHelperText>
        <FormErrorMessage>Error message</FormErrorMessage>
      </>
    ));

    return (
      <Wrapper>
        <ThemeProvider theme={theme}>
          <CSSReset />
          <Heading>{s_response.data.survey.survey.name}</Heading>
          <Text>{s_response.data.survey.survey.description}</Text>
          <Box>
            <FormControl>
              {questions}
            </FormControl>
          </Box>
        </ThemeProvider>
      </Wrapper>
    );
  } else {  
    return (
      <Text>Failed</Text>
    )
  }
};

Survey.getInitialProps = ({ query }) => {
  return {
    token: parseInt(query.token)
  }
}
export default Survey;
