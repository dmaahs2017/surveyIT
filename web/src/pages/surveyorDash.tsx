import React from "react";
import {
  ThemeProvider,
  CSSReset,
  theme,
  Heading,
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
      <div className="container">
        <Heading as="h1" textAlign="center">
          Surveyor Dashboard
        </Heading>

        <div className="columnsToVertical">
          <div className="col">
            <Heading as="h2">Unopened Surveys:</Heading>
            {PagedMeSurveys(0, 10, "New")}
          </div>
          <div className="col">
            <Heading as="h2" className="title">
              Your Open Surveys:{" "}
            </Heading>
            {PagedMeSurveys(0, 10, "Open")}
          </div>
          <div className="col">
            <Heading as="h2" className="title">
              Your Closed Surveys:{" "}
            </Heading>
            {PagedMeSurveys(0, 10, "Closed")}
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
        </div>
      </div>
    </Wrapper>
  </ThemeProvider>
);

export default SurveyorDash;
