import React from "react";
import {
  ThemeProvider,
  CSSReset,
  theme,
  Flex,
  Grid,
  Heading,
  List,
  ListItem,
} from "@chakra-ui/core";
import { NavBar } from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import { PagedSurveys } from "../components/survey";

const SurveyeeDash = () => (
  <ThemeProvider theme={theme}>
    <NavBar />
    <Wrapper>
      <CSSReset />
      <Flex flexDirection="column">
        <Heading mb="3rem" textAlign="center">
          Surveyee Dashboard
        </Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <Flex flexDirection="column">
            <Heading textAlign="center">Available Surveys</Heading>
            {PagedSurveys(0, 10)}
          </Flex>
          <Flex alignItems="center" flexDirection="column">
            <Heading textAlign="center">Completed Surveys</Heading>
            <List styleType="disc">
              <ListItem>Survey Details Component</ListItem>
            </List>
          </Flex>
          <Flex alignItems="center" flexDirection="column">
            <Heading textAlign="center">Other</Heading>
            <List styleType="disc">
              <ListItem>Survey Details Component</ListItem>
            </List>
          </Flex>
        </Grid>
      </Flex>
    </Wrapper>
  </ThemeProvider>
);

export default SurveyeeDash;
