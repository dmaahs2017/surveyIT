import React from "react";
import {
  ThemeProvider,
  CSSReset,
  theme,
  Grid,
  Flex,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Link,
  useDisclosure,
} from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { NewSurveyModal } from "./NewSurveyModal";

export const NavBar = () => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  let greet = data?.me ? "Hi " + data.me.username : "Register/Login";
  let items = null;
  let router = useRouter();

  if (!data?.me) {
    items = (
      <>
        <Link href="/login">
          <MenuItem>Login</MenuItem>
        </Link>
        <Link href="/register">
          <MenuItem>Register</MenuItem>
        </Link>
      </>
    );
  } else {
    let dash =
      data.me.typeOfUser === "SURVEYOR" ? "/surveyorDash" : "/surveyeeDash";
    items = (
      <>
        <MenuItem
          onClick={() => {
            router.push(dash);
          }}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push("/manageAccount");
          }}
        >
          Manage Account
        </MenuItem>
        <MenuItem
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          Logout
        </MenuItem>
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Grid
        templateColumns="repeat(2, 1fr)"
        gap={6}
        backgroundColor="purple.500"
      >
        <Flex alignItems="center">
          <Link href="/" ml="2">
            <Heading ml={2}>SurveyIT</Heading>
          </Link>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end">
          <Button onClick={onOpen} mr="4">
            <Text>Create New Survey</Text>
          </Button>
          <Menu>
            <MenuButton as={Button} mr="2" mb="2" mt="2">
              {greet}
              <MenuList>{items}</MenuList>
            </MenuButton>
          </Menu>
        </Flex>
      </Grid>
      
        <NewSurveyModal isOpen={isOpen} onClose={onClose} />
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Grid
          templateColumns="repeat(2, 1fr)"
          gap={6}
          backgroundColor="purple.500"
        >
          <Flex alignItems="center">
            <Link href="/" ml="2">
              <Heading ml={2}>SurveyIT</Heading>
            </Link>
          </Flex>
          <Flex alignItems="center" justifyContent="flex-end">
            <Menu>
              <MenuButton as={Button} mr="2" mb="2" mt="2">
                {greet}
                <MenuList>{items}</MenuList>
              </MenuButton>
            </Menu>
          </Flex>
        </Grid>

        <NewSurveyModal isOpen={isOpen} onClose={onClose} />
      </ThemeProvider>
    );
  }
};
