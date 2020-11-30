import React, { InputHTMLAttributes } from "react";
import { Box, Text, SimpleGrid } from "@chakra-ui/core";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  answerCount: number[];
  question: string;
  summaryStats: { mean: number; median: number; mode: number };
};

export const Result: React.FC<InputFieldProps> = ({
  answerCount,
  question,
  summaryStats,
}) => {
  return (
    <>
      <Box mb="10px">
        <Text fontWeight="bold">{question}:</Text>
      </Box>
      {answerCount.map((n) => (
        <Text fontWeight="semibold" mr="3">
          {n}
        </Text>
      ))}

      <SimpleGrid columns={3} mb="20px">
        <Text mr="3" fontStyle="italic" textDecor="underline">
          Mean
        </Text>
        <Text mr="3" fontStyle="italic" textDecor="underline">
          Median
        </Text>
        <Text mr="3" fontStyle="italic" textDecor="underline">
          Mode
        </Text>

        <Text>{summaryStats.mean.toFixed(2)}</Text>
        <Text>{summaryStats.median.toFixed(2)}</Text>
        <Text>{summaryStats.mode.toFixed(2)}</Text>
      </SimpleGrid>
    </>
  );
};
