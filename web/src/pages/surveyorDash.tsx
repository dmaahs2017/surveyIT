import React from "react";
import {
  ThemeProvider,
  CSSReset,
  theme,
  Heading,
  Flex,
  Box,
} from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { NavBar } from "../components/NavBar";
import { PagedMeSurveys } from "../components/survey";

const SurveyorDash = () => {
  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Wrapper>
        <CSSReset />
        <Heading as="h1" textAlign="center">
          Surveyor Dashboard
        </Heading>
        <Flex flexDir="column">
          <Box>
            <Heading as="h2">Unopened Surveys:</Heading>
            {PagedMeSurveys(0, 10, "New")}
          </Box>

          <Box>
            <Heading as="h2" className="title">
              Your Open Surveys:{" "}
            </Heading>
            {PagedMeSurveys(0, 10, "Open")}
          </Box>

          <Box>
            <Heading as="h2" className="title">
              Your Closed Surveys:{" "}
            </Heading>
            {PagedMeSurveys(0, 10, "Closed")}
          </Box>
          {/* commentting this out for now since we have no "Other" components for the dashboard
          <Box>
            <Heading as="h2" className="title">
                Other:{" "}
              </Heading>
              <List styleType="disc">
                <ListItem>Survey Details Component</ListItem>
              </List>
            </Box>
            */}
        </Flex>
      </Wrapper>
    </ThemeProvider>
  );
};

export default SurveyorDash;
