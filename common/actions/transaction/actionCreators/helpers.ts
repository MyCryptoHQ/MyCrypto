export { isEtherUnit, validNumber };

const isEtherUnit = (unit: string) => unit === 'ether';

// get rid of this copy paste in 2nd refactor
const validNumber = (num: number) => isFinite(num) && num > 0;
