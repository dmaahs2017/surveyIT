import React from "react";
import NextLink from "next/link";
import { useMeSurveysQuery, useSurveysQuery } from "../generated/graphql";
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
  Heading,
  Link,
  AccordionIcon,
  Stack,
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

export const PagedSurveys = (offset: number, limit: number) => {
  const [surveys_response] = useSurveysQuery({
    variables: {
      offset: offset,
      limit: limit,
    },
  });

  const surveys = surveys_response.data?.surveys.surveys;

  if (surveys && surveys.length > 0) {
    return (
      <Stack spacing={8}>
        {surveys.map((s) =>
          !s ? null : (
            <Box>
              <NextLink href="/survey/[token]" as={`/survey/${s.id}`}>
                <Link>
                  <Heading style={{ color: "blue" }} fontSize="l">
                    {s.name}
                  </Heading>
                </Link>
              </NextLink>
              <Text>{s.description}</Text>
            </Box>
          )
        )}
      </Stack>
    );
  } else {
    return <Text>No surveys available</Text>;
  }
};

export const PagedMeSurveys = (offset: number, limit: number) => {
  const [surveys_response] = useMeSurveysQuery({
    variables: {
      offset: offset,
      limit: limit,
    },
  });

  const surveys = surveys_response.data?.meSurveys.surveys;

  if (surveys && surveys.length > 0) {
    return (
      <Stack spacing={8}>
        {surveys.map((s) =>
          !s ? null : (
            <Box>
              <NextLink href="/survey/[token]" as={`/survey/${s.id}`}>
                <Link>
                  <Heading style={{ color: "blue" }} fontSize="l">
                    {s.name}
                  </Heading>
                </Link>
              </NextLink>
              <Text>{s.description}</Text>
            </Box>
          )
        )}
      </Stack>
    );
  } else {
    return <Text>No surveys available</Text>;
  }
};
