import { parse } from "json2csv";

export function jsonResultsToCsv(jsonResults: any): string {
  jsonResults.map((r) => {
    r.stronglyDisagree = r.answerCount[0];
    r.disagree = r.answerCount[1];
    r.neutral = r.answerCount[2];
    r.agree = r.answerCount[3];
    r.stronglyAgree = r.answerCount[4];
  });

  const fields = [
    "question",
    "stronglyDisagree",
    "disagree",
    "neutral",
    "agree",
    "stronglyAgree",
  ];
  const opts = { fields, flatten: true };

  return parse(jsonResults, opts);
}
