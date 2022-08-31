import BN from 'bn.js';
import { FormikErrors, FormikValues } from 'formik';

import { InlineMessageType, TUuid } from '@types';

const validDecimal = (input: string, decimal: number) => {
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
export const isFormValid = <Values extends FormikValues>(errors: FormikErrors<Values>) =>
  Object.values(errors).filter(
    (error) => error !== undefined && (!error.type || error.type === InlineMessageType.ERROR)
  ).length === 0;

export const isUuid = (uuid: string | TUuid) => {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return pattern.test(uuid);
};
