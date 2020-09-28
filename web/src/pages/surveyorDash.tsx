import React from 'react'
import {
  ThemeProvider,
  CSSReset,
  theme,
  Grid,
  Heading,
  Flex,
  List,
  ListItem
} from '@chakra-ui/core'
import { Wrapper } from '../components/Wrapper';
import {NavBar} from '../components/NavBar';

const SurveyorDash = () => (
  <ThemeProvider theme={theme}>
    <NavBar />
    <Wrapper>
      <CSSReset />
      <Grid
        templateColumns="repeat(1, 1fr)"
        gap={6}
        templateRows="repeat(3, 1fr)"
      >
        <Heading textAlign="center">Surveyor Dashboard</Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <Flex justifyContent="center" flexDirection="column">
            <Heading textAlign="center">Open Surveys</Heading>
            <List styleType="disc">
              <ListItem>Survey Preview Components</ListItem>
            </List>
          </Flex>
          <Flex justifyContent="center" flexDirection="column">
            <Heading textAlign="center">Closed Surveys</Heading>
            <List styleType="disc">
              <ListItem>Survey Preview Components</ListItem>
            </List>
          </Flex>
          <Flex justifyContent="center" flexDirection="column">
            <Heading textAlign="center">Other</Heading>
            <List styleType="disc">
              <ListItem>Survey Preview Components</ListItem>
            </List>
          </Flex>
        </Grid>
      </Grid>
    </Wrapper>
  </ThemeProvider>
)

export default SurveyorDash;
