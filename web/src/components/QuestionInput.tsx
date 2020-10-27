import React from "react";
import { InputField } from "./InputField";
import { Formik, Form } from "formik";
import { Button } from "@chakra-ui/core";
import { useCreateQuestionMutation } from "../generated/graphql";
import { useRouter } from "next/router";

type QuestionInputProps = InputHTMLAttributes<HTMLInputElement> & {
  surveyId: number;
  onClick: any;
};

export const QuestionInput: React.FC<QuestionInputProps> = ({
  surveyId,
  onClick,
}) => {
  const [, submitQuestion] = useCreateQuestionMutation();
  const router = useRouter();
  return (
    <Formik
      initialValues={{ question: "" }}
      onSubmit={async (values, { setErrors }) => {
        console.log(values.question);
        const response = await submitQuestion({
          survey_id: surveyId,
          q_str: values.question,
        });
        router.reload();
        onClick();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField
            name="question"
            placeholder="new survey question here"
            label="New Question"
          />
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
