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
} from "@chakra-ui/core";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { useRouter } from "next/router";

export const NavBar = () => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let greet = data?.me ? "Hi " + data.me.username : "Create an account";
  let items = null;
  let router = useRouter();

  if (!data?.me) {
    items = (
      <>
        <MenuItem as="a" href="/login">
          Login
        </MenuItem>
        <MenuItem as="a" href="/register">
          Register
        </MenuItem>
      </>
    );
  } else {
    items = (
      <>
        <MenuItem
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          Logout
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push("/manageAccount");
          }}
        >
          Manage Account
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
          <Heading ml={2}>SurveyIT</Heading>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end">
          <Menu>
            <MenuButton as={Button}>
              {greet}
              <MenuList>{items}</MenuList>
            </MenuButton>
          </Menu>
        </Flex>
      </Grid>
    </ThemeProvider>
  );
};
