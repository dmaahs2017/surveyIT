import React from "react";
import { useSurveysQuery } from "../generated/graphql";
import {
  Box,
  ThemeProvider,
  CSSReset,
  theme,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  Text,
  AccordionIcon,
} from "@chakra-ui/core";

export const SurveyTemplate = (name: string, description: string) => {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Accordion allowToggle display="inline">
        <AccordionItem defaultIsOpen>
          <AccordionHeader>
            <Text>{name}</Text>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel>
            <Text>{description}</Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </ThemeProvider>
  );
};

export const PagedSurveys = (offset, limit) => {
  const [{ data }] = useSurveysQuery({
    variables: {
      offset: offset,
      limit: limit,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (data) {
    return data.surveys.surveys.map((s) =>
      SurveyTemplate(s.name, s.description)
    );
  }
  return <Text>FUCK ME</Text>;
};
