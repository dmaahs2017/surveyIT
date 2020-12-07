import React from "react";
import {
  Button,
  ThemeProvider,
  CSSReset,
  theme,
  Text,
  Heading,
  Flex,
  Box,
  useDisclosure,
} from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { NavBar } from "../components/NavBar";
import { PayBalanceModal } from "../components/PayBalanceModal";
import { PagedMeSurveys } from "../components/survey";
import { useMeQuery } from "../generated/graphql";

const SurveyorDash = () => {
  const [me] = useMeQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Wrapper>
        <CSSReset />
        <Heading as="h1" textAlign="center">
          Surveyor Dashboard
        </Heading>
        <Flex flexDir="column">
          <Box mb="10px">
            <Heading as="h2">Unopened Surveys:</Heading>
            {PagedMeSurveys(0, 10, "New")}
          </Box>

          <hr />

          <Box mb="10px">
            <Heading as="h2" className="title">
              Your Open Surveys:{" "}
            </Heading>
            {PagedMeSurveys(0, 10, "Open")}
          </Box>

          <hr />

          <Box mb="10px">
            <Heading as="h2" className="title">
              Your Closed Surveys:{" "}
            </Heading>
            {PagedMeSurveys(0, 10, "Closed")}
          </Box>

          <hr />

          {me.data?.me?.balance == undefined ? null : (
            <Box mb="10px">
              <Flex alignItems="center">
                <Heading as="h2">Balance</Heading>
                <Button ml="20px" onClick={onOpen}>
                  Pay Balance
                </Button>
              </Flex>
              <Text>Outstanding Balance: ${me.data.me.balance.toFixed(2)}</Text>
            </Box>
          )}
        </Flex>
      </Wrapper>

      <PayBalanceModal isOpen={isOpen} onClose={onClose} />
    </ThemeProvider>
  );
};

export default SurveyorDash;
