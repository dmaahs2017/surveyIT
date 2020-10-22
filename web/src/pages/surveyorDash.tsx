import React from "react";
import {
  ThemeProvider,
  CSSReset,
  theme,
  Grid,
  Heading,
  Flex,
  List,
  ListItem,
} from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { NavBar } from "../components/NavBar";
import { PagedMeSurveys } from "../components/survey";

const SurveyorDash = () => (
  <ThemeProvider theme={theme}>
    <NavBar />
    <Wrapper>
      <CSSReset />
      <Flex flexDirection="column">
        <Heading mb="3rem" textAlign="center">
          Surveyor Dashboard
        </Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <Flex flexDirection="column">
            <Heading textAlign="center">Your Open Surveys</Heading>
            {PagedMeSurveys(0, 1)}
          </Flex>
          <Flex alignItems="center" flexDirection="column">
            <Heading textAlign="center">Your Closed Surveys</Heading>
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

export default SurveyorDash;
