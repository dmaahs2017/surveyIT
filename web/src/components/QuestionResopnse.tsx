import React from "react";
import { Field, Formik, Form } from "formik";
import { Text, Button } from "@chakra-ui/core";
import { useSubmitSurveyMutation } from "../generated/graphql";

type props = InputHTMLAttributes<HTMLInputElement> & {
  surveyId: number;
  questionId: number;
};

export const QuestionResponse: React.FC<props> = ({ surveyId, questionId }) => {
  const [, submitSurvey] = useSubmitSurveyMutation();
  return (
    <Formik
      initialValues={{ answer: "2" }}
      onSubmit={async (values, { setErrors }) => {
        const response = await submitSurvey({
          surveyId,
          answers: [
            {
              questionId,
              answer: parseInt(values.answer),
            },
          ],
        });
        console.log("==========DBG==============");
        console.log(response.data?.submitSurvey);
        console.log("==========DBG==============");
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Text mr="2">
            <Field type="radio" name="answer" value="0" />
            Strongly Disagree
          </Text>

          <Text mr="2">
            <Field type="radio" name="answer" value="1" />
            Disagree
          </Text>

          <Text mr="2">
            <Field type="radio" name="answer" value="2" />
            Neutral
          </Text>

          <Text mr="2">
            <Field type="radio" name="answer" value="3" />
            Agree
          </Text>

          <Text mr="2">
            <Field type="radio" name="answer" value="4" />
            Strongly Agree
          </Text>
          <Button
            mt={4}
            type="submit"
            isLoading={isSubmitting}
            variantColor="teal"
          >
            Submit Question
          </Button>
        </Form>
      )}
    </Formik>
  );
};
