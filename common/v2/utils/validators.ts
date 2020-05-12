import BN from 'bn.js';
import { FormikErrors } from 'formik';

import { InlineMessageType } from '@types';

export const validNumber = (num: BN) => isFinite(num.toNumber()) && num.gten(0);
export const numberIsNotNegative = (num: BN) => validNumber(num) && !num.isNeg();

export const validDecimal = (input: string, decimal: number) => {
  const arr = input.split('.');

  // Only a single decimal can exist.
  if (arr.length > 2) {
    return false;
  }

  const fractionPortion = arr[1];

  if (!fractionPortion || fractionPortion.length === 0) {
    return true;
  }

  const decimalLength = fractionPortion.length;

  return decimalLength <= decimal;
};

export const isValidAmount = (decimal: number) => (amount: string) => {
  const convertedAmount: BN = new BN(amount);
  return !convertedAmount.isNeg() && validDecimal(amount, decimal);
};

export const isTransactionDataEmpty = (data: string) => ['', '0x', '0x0', '0x00'].includes(data);

// allow warnings and info errors type for form to still be valid
export const isFormValid = (errors: FormikErrors<object>) =>
  Object.values(errors).filter(
    (error) => error !== undefined && (!error.type || error.type === InlineMessageType.ERROR)
  ).length === 0;
