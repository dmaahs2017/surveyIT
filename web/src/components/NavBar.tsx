import React from "react";
import { Box, Link, Flex, Button, Image } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import logo_white from "../images/logo_white.png";


interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let body = null;
  //src={logo_white} doesnt work
  let logo = <a href="/"><img style={{width:"2vh", height:"auto"}} src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/52c29c52-488c-43d1-b38a-f244eb03a50f/de5wjmm-3bdd27f8-eac0-4e20-baf3-5349d0685870.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNTJjMjljNTItNDg4Yy00M2QxLWIzOGEtZjI0NGViMDNhNTBmXC9kZTV3am1tLTNiZGQyN2Y4LWVhYzAtNGUyMC1iYWYzLTUzNDlkMDY4NTg3MC5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.R5qopRUz4NvAjAB7H2shEi7StKrKzNE965-H4IjA2CM" /></a>

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="#7851a9" p={4}>

        {logo}

      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
