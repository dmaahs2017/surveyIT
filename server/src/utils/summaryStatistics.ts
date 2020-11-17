import { SummaryStatistics } from "../resolvers/object-types";

export function summaryStatistics(values: number[]): SummaryStatistics {
  let n = 0;
  let total = 0;
  let mode = 0;
  let flattend: number[] = [];
  values.map((v, i) => {
    n += v;
    total += v * i;
    if (v > mode) {
      mode = i;
    }
    flattend.push(i);
  });

  flattend.sort();

  return {
    mean: total / n,
    median: flattend[n / 2],
    mode: mode,
  };
}
