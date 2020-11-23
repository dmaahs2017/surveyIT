import React from "react";
import { Field } from "formik";
import { Box, Text, Flex } from "@chakra-ui/core";

export const QuestionResponse = (i: number) => {
  return (
    <Flex className="questionContainer">
      <div className="surveyAnswer">
        <Text mr="2">
          <Field
            className="radioButton"
            type="radio"
            name={"responses[" + i + "].answer"}
            value="0"
          />
          <i className="smallText">Strongly Disagree</i>
        </Text>
      </div>
      <div className="surveyAnswer">
        <Text mr="2">
          <Field
            className="radioButton"
            type="radio"
            name={"responses[" + i + "].answer"}
            value="1"
          />
          <i className="smallText">Disagree</i>
        </Text>
      </div>
      <div className="surveyAnswer">
        <Text mr="2">
          <Field
            className="radioButton"
            type="radio"
            name={"responses[" + i + "].answer"}
            value="2"
          />
          <i className="smallText">Neutral</i>
        </Text>
      </div>
      <div className="surveyAnswer">
        <Text mr="2">
          <Field
            className="radioButton"
            type="radio"
            name={"responses[" + i + "].answer"}
            value="3"
          />
          <i className="smallText">Agree</i>
        </Text>
      </div>
      <div className="surveyAnswer">
        <Text mr="2">
          <Field
            className="radioButton"
            type="radio"
            name={"responses[" + i + "].answer"}
            value="4"
          />
          <i className="smallText">Strongly Agree</i>
        </Text>
      </div>
    </Flex>
  );
};
