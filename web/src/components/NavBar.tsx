import React from 'react'
import {
  ThemeProvider,
  CSSReset,
  theme,
  Grid,
  Flex,
  Heading,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
} from '@chakra-ui/core'
import { useMeQuery } from "../generated/graphql";

export const NavBar = () => {
  const [{ data, fetching }] = useMeQuery(); 
  let greet = data?.me ? ("Hi " + data.me.username) : "Create an account";

  return (

  <ThemeProvider theme={theme}>
    <CSSReset />
    <Grid templateColumns="repeat(2, 1fr)" gap={6} backgroundColor="purple.500">
      <Flex alignItems="center">
        <Heading ml={2}>SurveyIT</Heading>
      </Flex>
      <Flex alignItems="center" justifyContent="flex-end">
        <Menu>
          <MenuButton as={Button}>
            {greet}
            <MenuList>
              <MenuItem>Logout</MenuItem>
              <MenuItem as="a" href="/login">Login</MenuItem>
              <MenuItem as="a" href="/register">Register</MenuItem>
            </MenuList>
          </MenuButton>
        </Menu>
      </Flex>
    </Grid>
  </ThemeProvider>
)
}
