// TODO - move this out of transaction; it's only for estimating gas costs
export type GasEstimationTransaction = {|
  to: string,
  value: string | number,
  data: string,
  from: string
|};
