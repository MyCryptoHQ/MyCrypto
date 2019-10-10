export const toFixedWithoutZero = (val: number | string, decimals: number): number => {
  return Number(Number(val).toFixed(decimals));
};
