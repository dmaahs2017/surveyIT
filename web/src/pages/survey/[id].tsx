import React, { useState } from "react";
import { NextPage } from "next";
import {
  ThemeProvider,
  Grid,
  SimpleGrid,
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
import { InputField } from "../../components/InputField";
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
  useDeleteSurveyMutation,
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
  const [, deleteSurvey] = useDeleteSurveyMutation();
  let survey = null;
  let surveyName = null;
  let surveyDesc = null;
  let surveyStatus = null;
  const [modalState, setModalState] = useState("");

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
        <div className="surveyScrollbar">
          <NavBar />
          <ThemeProvider theme={theme}>
            <CSSReset />
            <div className="surveyContainer">
              <Heading>{surveyName}</Heading>
              <Text className="surveyDescription">{surveyDesc}</Text>

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
                        <div style={{ textAlign: "center" }}>
                          <FormLabel>
                            <p className="surveyQuestion">{q.question}</p>
                          </FormLabel>
                          {QuestionResponse(i)}
                        </div>
                      ))
                    }
                  />
                  <div className="submitButton">
                    <Button type="submit">Submit</Button>
                  </div>
                </Form>
              </Formik>
            </div>
          </ThemeProvider>
        </div>
      );
    } else {
      //else creator of survey
      const questions = q_response.data.questions.questions.map((q, i) => (
        <Box mb="20px">
          <Text fontSize="lg" display="inline" fontWeight="bold">
            Question {i + 1}:
          </Text>
          <Text display="inline"> {q.question}</Text>
        </Box>
      ));
      const opensAt = s_response.data.survey.survey.opensAt;
      const closesAt = s_response.data.survey.survey.closesAt;
      let modalNewQuestion = (
        <>
          <QuestionInput
            meId={me_response.data.me.id}
            surveyId={s_response.data.survey.survey.id}
            onClick={onClose}
          />
        </>
      );
      let modalDateOptions = (
        <Flex flexDirection="column">
          <p>You can immediately open or close your survey:</p>
          <Button
            mr="3"
            mt="3"
            mb="3"
            onClick={async () => {
              await openSurvey({ surveyId });
              router.reload();
            }}
          >
            Open Survey
          </Button>
          <Button
            mr="3"
            mt="3"
            mb="3"
            onClick={async () => {
              await closeSurvey({ surveyId });
              router.reload();
            }}
          >
            Close Survey
          </Button>
          <p>Alternatively, schedule a date:</p>
          <Formik
            initialValues={{ date: new Date() }}
            onSubmit={async (values) => {
              await openSurvey({ surveyId, openAt: values.date });
              router.reload();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box mr="3">
                  <InputField
                    name="date"
                    label="Schedule a Date to Open the survey"
                    type="date"
                  />
                  <Button type="submit" isLoading={isSubmitting}>
                    Schedule Open Date
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
          <br></br>
          <Formik
            initialValues={{ date: new Date() }}
            onSubmit={async (values) => {
              await closeSurvey({ surveyId, closeAt: values.date });
              router.reload();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box>
                  <InputField
                    name="date"
                    label="Schedule a Date to Close the survey"
                    type="date"
                  />
                  <Button type="submit" isLoading={isSubmitting}>
                    Schedule Close Date
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Flex>
      );
      survey = (
        <>
          <NavBar />
          <Wrapper>
            <ThemeProvider theme={theme}>
              <CSSReset />
              <Grid templateColumns="repeat(2, 1fr)">
                <Heading>{surveyName}</Heading>
                <Flex justifyContent="flex-end">
                  <Button
                    variantColor="red"
                    onClick={async () => {
                      await deleteSurvey({ surveyId });
                      router.push("/surveyorDash");
                    }}
                  >
                    Delete Survey
                  </Button>
                </Flex>
              </Grid>
              <Text fontSize="lg">{surveyDesc}</Text>
              <SimpleGrid columns={3}>
                <Heading as="h3" fontSize="base">
                  Survey Status: {surveyStatus}
                </Heading>

                <Box />
                <Box />

                <Box>
                  <Text display="inline" fontWeight="bold">
                    Opens At
                  </Text>
                  <Text display="inline" mr="3">
                    :{" "}
                    {opensAt
                      ? new Date(opensAt).toLocaleDateString()
                      : "Not Scheduled"}
                  </Text>
                </Box>

                <Box>
                  <Text display="inline" fontWeight="bold">
                    Closes At
                  </Text>
                  <Text display="inline">
                    :{" "}
                    {closesAt
                      ? new Date(closesAt).toLocaleDateString()
                      : "Not Scheduled"}
                  </Text>
                </Box>

                <Box />

                <Box>
                  <Text display="inline" fontWeight="bold">
                    Points remaining in this survey:{" "}
                  </Text>
                  <Text display="inline">
                    {s_response.data.survey.survey.availablePoints}
                  </Text>
                </Box>

                <Box>
                  <Text display="inline" fontWeight="bold">
                    Remaining Promoted Responses:{" "}
                  </Text>
                  <Text display="inline">
                    {s_response.data.survey.survey.availablePoints /
                      s_response.data.survey.survey.rewardsRate}
                  </Text>
                </Box>

                <Box>
                  <Text display="inline" fontWeight="bold">
                    Rewards Rate:{" "}
                  </Text>
                  <Text display="inline">
                    {s_response.data.survey.survey.rewardsRate} Points
                  </Text>
                </Box>
              </SimpleGrid>
              <br></br>
              <Button
                style={{ marginTop: 10, marginBottom: 10 }}
                onClick={() => {
                  onOpen();
                  setModalState("Date Options");
                }}
              >
                Open/Close Options
              </Button>
              <Box>
                <FormControl>{questions}</FormControl>
              </Box>
            </ThemeProvider>
            {surveyStatus === "New" || surveyStatus === "Scheduled To Open" ? (
              <Button
                onClick={() => {
                  onOpen();
                  setModalState("New Question");
                }}
              >
                "Add a new question"
              </Button>
            ) : null}
          </Wrapper>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New Question</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {modalState === "New Question"
                  ? modalNewQuestion
                  : modalDateOptions}
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      );
    }
  } else {
    survey = <Text>Failed</Text>;
  }

  return <>{survey}</>;
};

Survey.getInitialProps = ({ query }) => {
  return {
    id: parseInt(query.id as string),
  };
};
export default Survey;
