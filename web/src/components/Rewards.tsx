import React from "react";
import { SimpleGrid, Box, Text, Image } from "@chakra-ui/core";

export const Rewards = () => {
  return (
    <SimpleGrid columns={3} maxW="700px">
      {/* Rewards 1*/}

      <Image
        maxH="100px"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGRPKiZkCDgJYbOEsQaMssOqjT6wZJCBV6h2mATQy89kW7iZcEUGK7lyHIjSQ9-2wYnNNEsAio&usqp=CAc"
      />
      <Text textAlign="center" pt="30px" verticalAlign="center">
        Redeem $25 Amazon Giftcard
      </Text>
      <Text textAlign="center" pt="30px" verticalAlign="center">
        Costs: 50 points
      </Text>

      <Image
        maxH="100px"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGRPKiZkCDgJYbOEsQaMssOqjT6wZJCBV6h2mATQy89kW7iZcEUGK7lyHIjSQ9-2wYnNNEsAio&usqp=CAc"
      />
      <Text textAlign="center" pt="30px" verticalAlign="center">
        Redeem $50 Amazon Giftcard
      </Text>
      <Text textAlign="center" pt="30px" verticalAlign="center">
        Costs: 95 points
      </Text>

      <Image
        maxH="100px"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGRPKiZkCDgJYbOEsQaMssOqjT6wZJCBV6h2mATQy89kW7iZcEUGK7lyHIjSQ9-2wYnNNEsAio&usqp=CAc"
      />
      <Text textAlign="center" pt="30px" verticalAlign="center">
        Redeem $100 Amazon Giftcard
      </Text>
      <Text textAlign="center" pt="30px" verticalAlign="center">
        Costs: 190 points
      </Text>
    </SimpleGrid>
  );
};
