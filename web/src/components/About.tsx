import React from "react";
import { Heading, List, ListItem, SimpleGrid, Image } from "@chakra-ui/core";
import { Wrapper } from "./Wrapper";

interface AboutProps {}

export const About: React.FC<AboutProps> = ({}) => {
  return (
    <Wrapper>
      <SimpleGrid alignItems="center">
        <Heading size="2xl" textAlign="center">
          Welcome to SurveyIt
        </Heading>
        <Image
          src="../resources/images/surveyIT.png"
          fallbackSrc="https://cdn.searchenginejournal.com/wp-content/uploads/2019/07/top-5-free-survey-makers.png"
          alt="Not loaded..."
        />
        <Heading as="h3" textAlign="center">
          Our Mission
        </Heading>
        <List styleType="disc">
          <ListItem>Lorem ipsum dolor sit amet</ListItem>
          <ListItem>Consectetur adipiscing elit</ListItem>
          <ListItem>Integer molestie lorem at massa</ListItem>
          <ListItem>Facilisis in pretium nisl aliquet</ListItem>
        </List>
      </SimpleGrid>
    </Wrapper>
  );
};
