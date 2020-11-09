import React, { useState } from "react";
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
  Button,
  useDisclosure,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/core";
import { Wrapper } from "../../components/Wrapper";
import { NavBar } from "../../components/NavBar";
import { QuestionInput } from "../../components/QuestionInput";
import { QuestionResponse } from "../../components/QuestionResopnse";
import { FieldArray, Formik, Form } from "formik";
import { useRouter } from "next/router";
import {
  useMeQuery,
  useSurveyQuery,
  useQuestionsQuery,
  useSubmitSurveyMutation,
  useCloseSurveyMutation,
  useOpenSurveyMutation,
} from "../../generated/graphql";
import { getSurveyStatusFromDates } from "../../utils/datetime";

const Survey: NextPage<{ id: number }> = ({ id }) => {
  const router = useRouter();
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
  const [me_response] = useMeQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [, submitResponse] = useSubmitSurveyMutation();
  const [, closeSurvey] = useCloseSurveyMutation();
  const [, openSurvey] = useOpenSurveyMutation();
  let survey = null;
  let surveyName = null;
  let surveyDesc = null;
  let surveyStatus = null;

  if (
    id &&
    q_response.data &&
    s_response.data?.survey.survey &&
    me_response.data
  ) {
    surveyName = s_response.data.survey.survey.name;
    surveyDesc = s_response.data.survey.survey.description;
    surveyStatus = getSurveyStatusFromDates(
      s_response.data.survey.survey.opensAt,
      s_response.data.survey.survey.closesAt
    );
    const surveyId = s_response.data.survey.survey.id;

    //if not creator of survey
    if (s_response.data.survey.survey.creator.id != me_response.data.me?.id) {
      survey = (
        <Wrapper>
          <ThemeProvider theme={theme}>
            <CSSReset />
            <Flex flexDir="row-reverse" justifyContent="space-around">
              <Heading>{surveyName}</Heading>
              <Text>{surveyDesc}</Text>
              <Formik
                initialValues={{
                  responses: q_response.data.questions.questions,
                }}
                onSubmit={async (values, { setErrors }) => {
                  let answers = [];
                  for (let i = 0; i < values.responses.length; i++) {
                    answers.push({
                      answer: parseInt(values.responses[i].answer),
                      questionId: values.responses[i].id,
                    });
                  }
                  const response = await submitResponse({
                    surveyId: surveyId,
                    answers: answers,
                  });

                  if (response) {
                    router.push("/surveyeeDash");
                  }
                }}
              >
                <Form>
                  <FieldArray
                    name="responses"
                    render={() =>
                      q_response.data?.questions.questions.map((q, i) => (
                        <>
                          <FormLabel>{q.question}</FormLabel>
                          {QuestionResponse(i)}
                        </>
                      ))
                    }
                  />
                  <Button type="submit">Submit</Button>
                </Form>
              </Formik>
            </Flex>
          </ThemeProvider>
        </Wrapper>
      );
    } else {
      //else creator of survey
      const questions = q_response.data.questions.questions.map((q) => (
        <>
          <FormLabel>{q.question}</FormLabel>
          <Input />
          <FormHelperText>Helper Text</FormHelperText>
          <FormErrorMessage>Error message</FormErrorMessage>
        </>
      ));
      survey = (
        <>
          <Wrapper>
            <ThemeProvider theme={theme}>
              <CSSReset />
              <Heading>{surveyName}</Heading>
              <Text fontSize="lg">{surveyDesc}</Text>
              <Heading as="h3" fontSize="base">
                Survey Status: {surveyStatus}
              </Heading>
              <Button
                onClick={async () => {
                  await openSurvey({ surveyId });
                  router.reload();
                }}
              >
                Open Survey
              </Button>
              <Button
                onClick={async () => {
                  await closeSurvey({ surveyId });
                  router.reload();
                }}
              >
                Close Survey
              </Button>
              <Box>
                <FormControl>{questions}</FormControl>
              </Box>
            </ThemeProvider>
            <Button onClick={onOpen}>"Add a new question"</Button>
          </Wrapper>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New Question</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <QuestionInput
                  meId={me_response.data.me.id}
                  surveyId={s_response.data.survey.survey.id}
                  onClick={onClose}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
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
