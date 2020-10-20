import React from "react";
import NextLink from "next/link";
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

  if (surveys_response.data) {
    return (
      <Stack spacing={8}>
        {surveys_response.data.surveys.surveys.map((s) =>
          !s ? null : (
            <Box>
              <NextLink href="/survey/[token]" as={`/survey/${s.id}`}>
                <Link>
                  <Heading fontSize="l">{s.name}</Heading>
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
