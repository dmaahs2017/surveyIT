export const answerToString = (id: number) => {
  switch (id) {
    case 0: {
      return "Strongly Disagree";
    }
    case 1: {
      return "Disagree";
    }
    case 2: {
      return "Neutral";
    }
    case 3: {
      return "Agree";
    }
    case 4: {
      return "Strongly Agree";
    }
    default: {
      return "Error convertering answer to string";
    }
  }
};
