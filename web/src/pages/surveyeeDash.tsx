import React from "react";
import {
  ThemeProvider,
  CSSReset,
  theme,
  Heading,
  List,
  Flex,
  ListItem,
  SimpleGrid,
  Text,
  Box,
} from "@chakra-ui/core";
import { NavBar } from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import { PagedSurveys } from "../components/survey";
import { useMeQuery } from "../generated/graphql";

const SurveyeeDash = () => {
  const [me] = useMeQuery();

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Wrapper>
        <CSSReset />
        <Heading as="h1" textAlign="center">
          Surveyee Dashboard
        </Heading>
        <Flex flexDir="column">
          <Box minH="100px">
            <Heading as="h2">Available Surveys:</Heading>
            <Box ml="50px">{PagedSurveys(0, 10)}</Box>
          </Box>

          <Box minH="100px">
            <Heading as="h2" className="title">
              Completed Surveys:
            </Heading>
          </Box>

          <Box>
            <Heading as="h2" className="title">
              Rewards:{" "}
            </Heading>

            <Box ml="50px" fontSize="xl" minH="100px">
              <Text display="inline">Rewards Points: </Text>
              <Text display="inline" fontStyle="italic" fontWeight="semibold">
                {me.data?.me?.rewards}
              </Text>
            </Box>
          </Box>
        </Flex>
      </Wrapper>
    </ThemeProvider>
  );
};
export default SurveyeeDash;
