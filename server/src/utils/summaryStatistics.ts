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

  const mid = Math.floor(n / 2);
  return {
    mean: total / n,
    median: n % 2 === 0 ? flattend[mid] : (flattend[mid] + flattend[mid]) / 2,
    mode: mode,
  };
}
