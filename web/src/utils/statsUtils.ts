export interface SummaryStatistics {
  mean: number;
  median: number;
  mode: number;
}

export interface Result {
  question: string;
  answer: number;
  userId: number;
  userIncome: string;
  userGender: string;
}

export interface QuestionBreakdown {
  question: string;
  answerCount: number[];
  summaryStats: SummaryStatistics;
}

export function summaryStatistics(values: number[]): SummaryStatistics {
  let n = 0;
  let total = 0;
  let mode = 0;
  let median = 0;
  let flattend: number[] = [];
  values.map((count, index) => {
    n += count;
    total += count * index;
    if (count > mode) {
      mode = index;
    }

    for (let j = 0; j < count; j++) {
      flattend.push(index);
    }
  });

  flattend.sort();

  const mid = Math.floor(flattend.length / 2);
  if (flattend.length % 2) {
    //if it's odd number of answers
    median = flattend[mid];
  } //end if
  else {
    //if it's even
    median = (flattend[mid] + flattend[mid - 1]) / 2.0;
  } //end else

  return {
    mean: total / n,
    median: median,
    mode: mode,
  };
}

export function groupResultsByGender(
  results: Result[]
): [Result[], Result[], Result[]] {
  let male: Result[] = [];
  let female: Result[] = [];
  let other: Result[] = [];

  results.map((r) => {
    if (r.userGender === "MALE") {
      male.push(r);
    } else if (r.userGender === "FEMALE") {
      female.push(r);
    } else {
      other.push(r);
    }
  });

  return [male, female, other];
}

export function fromResultList(results: Result[]): QuestionBreakdown[] {
  let questionBreakdown: QuestionBreakdown[] = [];

  results.map((x) => {
    if (
      !questionBreakdown.find((n) => {
        return n.question === x.question;
      })
    ) {
      questionBreakdown.push({
        question: x.question,
        answerCount: new Array(5),
        summaryStats: { mean: -1, median: -1, mode: -1 },
      });
    }
  });

  questionBreakdown.map((qi) => {
    qi.answerCount = [0, 0, 0, 0, 0];
    results.map((x) => {
      if (qi.question == x.question) {
        qi.answerCount[x.answer] += 1;
      }
      qi.summaryStats = summaryStatistics(qi.answerCount);
    });
  });

  return questionBreakdown;
}
