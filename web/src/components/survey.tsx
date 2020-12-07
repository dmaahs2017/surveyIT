import React from "react";
import NextLink from "next/link";
import { useMeSurveysQuery, useSurveysQuery } from "../generated/graphql";
import { getSurveyStatusFromDates } from "../utils/datetime";
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
        {surveys.map((s) => {
          if (!s || getSurveyStatusFromDates(s.opensAt, s.closesAt) != "Open") {
            return null;
          } else {
            return (
              <Box
                border="2px"
                borderColor="grey"
                borderRadius="md"
                paddingLeft="8px"
              >
                <Box>
                  <NextLink href="/survey/[token]" as={`/survey/${s.id}`}>
                    <Link>
                      <Heading
                        display="inline"
                        style={{ color: "blue" }}
                        fontSize="xl"
                      >
                        {s.name}
                      </Heading>
                      <Text
                        ml="8px"
                        display="inline"
                        fontWeight="semibold"
                        fontSize="lg"
                      >
                        Earn: {s.rewardsRate} points!
                      </Text>
                    </Link>
                  </NextLink>
                </Box>
                <Text ml="25px" fontStyle="italic">
                  {s.description}
                </Text>
              </Box>
            );
          }
        })}
      </Stack>
    );
  } else {
    return <Text>No surveys available</Text>;
  }
};

export const PagedMeSurveys = (
  offset: number,
  limit: number,
  status: "Open" | "Closed" | "New"
) => {
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
        {surveys.map((s) => {
          if (!s || getSurveyStatusFromDates(s.opensAt, s.closesAt) != status) {
            return null;
          } else {
            return (
              <Box
                border="2px"
                borderColor="grey"
                borderRadius="md"
                paddingLeft="8px"
              >
                <Text fontSize="xl" fontWeight="bold" display="inline" mr="3">
                  {s.name}
                </Text>
                <NextLink href="/survey/[token]" as={`/survey/${s.id}`}>
                  <Link>
                    <Text
                      mr="5"
                      display="inline"
                      style={{ color: "blue" }}
                      fontSize="l"
                    >
                      Manage
                    </Text>
                  </Link>
                </NextLink>
                <NextLink
                  href="/survey/results/[token]"
                  as={`/survey/results/${s.id}`}
                >
                  <Link>
                    <Text
                      display="inline"
                      style={{ color: "blue" }}
                      fontSize="l"
                    >
                      Results
                    </Text>
                  </Link>
                </NextLink>
                <Text>{s.description}</Text>
              </Box>
            );
          }
        })}
      </Stack>
    );
  } else {
    return <Text>No surveys available</Text>;
  }
};
