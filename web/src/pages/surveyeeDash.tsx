import { NavBar } from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import { Flex, Grid, Text } from "@chakra-ui/core"

const SurveyeeDash = () => (
  <>
    <NavBar />
    <Wrapper>
      <Grid autoRows="">
        <Flex>
          <Text>Survey1</Text>
        </Flex>
        <Flex>
          <Text>Survey2</Text>
        </Flex>
        <Flex>
          <Text>Survey3</Text>
        </Flex>
        <Flex>
          <Text>Survey4</Text>
        </Flex>
      </Grid>
    </Wrapper>
  </>
);

export default SurveyeeDash;
