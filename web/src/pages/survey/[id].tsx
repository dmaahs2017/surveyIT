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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/core";
import { Wrapper } from "../../components/Wrapper";
import { NavBar } from "../../components/NavBar";
import { QuestionInput } from "../../components/QuestionInput";
import {
  useMeQuery,
  useSurveyQuery,
  useQuestionsQuery,
} from "../../generated/graphql";

const Survey: NextPage<{ id: number }> = ({ id }) => {
  const [q_response] = useQuestionsQuery({
    variables: {
      offset: 0,
      limit: 10,
      survey_id: id,
    },
    //notifyOnNetworkStatusChange: true,
  });
  const [s_response] = useSurveyQuery({
    variables: {
      survey_id: id,
    },
  });
  const [me_response] = useMeQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  let survey = null;
  let surveyName = null;
  let surveyDesc = null;

  if (id && q_response.data && s_response.data?.survey.survey && me_response.data) {
    surveyName = s_response.data.survey.survey.name;
    surveyDesc = s_response.data.survey.survey.description;

    if (s_response.data.survey.survey.creator.id != me_response.data.me?.id) {
      const questions = q_response.data.questions.questions.map((q) => (
        <>
          <FormLabel>{q.question}</FormLabel>
          <Input />
          <FormHelperText>Helper Text</FormHelperText>
          <FormErrorMessage>Error message</FormErrorMessage>
        </>
      ));

      survey = (
        <Wrapper>
          <ThemeProvider theme={theme}>
            <CSSReset />
            <Heading>{surveyName}</Heading>
            <Text>{surveyDesc}</Text>
            <Box>
              <FormControl>{questions}</FormControl>
            </Box>
          </ThemeProvider>
        </Wrapper>
      );
    } else {
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
              <Text>{surveyDesc}</Text>
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
