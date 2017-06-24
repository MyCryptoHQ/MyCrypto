//flow

export function toFixedIfLarger(number: number, fixedSize: number = 6): string {
  return parseFloat(number.toFixed(fixedSize)).toString();
}
