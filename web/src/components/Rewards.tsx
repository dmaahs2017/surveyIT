import React from "react";
import { Button, SimpleGrid, Text, Image } from "@chakra-ui/core";
import { useRedeemRewardMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

export const Rewards = () => {
  const [, redeemReward] = useRedeemRewardMutation();

  const redeem = async (points: number, dollars: number) => {
    if (
      window.confirm(
        `Are you sure you want to redeem ${points} points for a $${dollars} amazon gifcard?`
      )
    ) {
      let response = await redeemReward({
        cost: points,
        reward: `$${dollars} amazon code`,
      });
      if (response.data?.redeemReward.errors) {
        alert(
          response.data.redeemReward.errors.map((e) => e.message).join("\n")
        );
      }
    }
  };
  return (
    <SimpleGrid columns={4} maxW="700px">
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
      <Button mt="25px" onClick={() => redeem(50, 25)}>
        Redeem
      </Button>

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
      <Button mt="25px" onClick={() => redeem(95, 50)}>
        Redeem
      </Button>

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
      <Button mt="25px" onClick={() => redeem(190, 100)}>
        Redeem
      </Button>
    </SimpleGrid>
  );
};
