import React from "react";
import { Field } from "formik";
import { Box, Text } from "@chakra-ui/core";

export const QuestionResponse = (i: number) => {
  return (
    <Box justifyItems="center">
      <Text mr="2">
        <Field type="radio" name={"responses[" + i + "].answer"} value="0" />
        Strongly Disagree
      </Text>

      <Text mr="2">
        <Field type="radio" name={"responses[" + i + "].answer"} value="1" />
        Disagree
      </Text>

      <Text mr="2">
        <Field type="radio" name={"responses[" + i + "].answer"} value="2" />
        Neutral
      </Text>

      <Text mr="2">
        <Field type="radio" name={"responses[" + i + "].answer"} value="3" />
        Agree
      </Text>

      <Text mr="2">
        <Field type="radio" name={"responses[" + i + "].answer"} value="4" />
        Strongly Agree
      </Text>
    </Box>
  );
};
