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
      <div className="container">
        <Heading as="h1" textAlign="center">
          Surveyor Dashboard
        </Heading>

        <Flex className="columnsToVertical">
          <div className="col">
            <Heading as="h2" className="title">
              Available Surveys:{" "}
            </Heading>
            <div style={{overflowY:"scroll"}}>
            {PagedSurveys(0, 100)}
            </div>
          </div>
          <div className="col">
            <Heading as="h2" className="title">
              Completed Surveys:{" "}
            </Heading>
            <List styleType="disc">
              <ListItem>Survey Details Component</ListItem>
            </List>
          </div>
          <div className="col">
            <div>
              <Heading as="h2" className="title">
                Other:{" "}
              </Heading>
              <List styleType="disc">
                <ListItem>Survey Details Component</ListItem>
              </List>
            </div>
          </div>
        </Flex>
      </div>
    </Wrapper>
  </ThemeProvider>
);

export default SurveyeeDash;
