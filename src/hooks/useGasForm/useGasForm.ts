import { FormikConfig, FormikValues, useFormik } from 'formik';
import { number } from 'yup';

import {
  GAS_LIMIT_LOWER_BOUND,
  GAS_LIMIT_UPPER_BOUND,
  GAS_PRICE_GWEI_LOWER_BOUND,
  GAS_PRICE_GWEI_UPPER_BOUND
} from '@config';
import { validateGasLimitField, validateGasPriceField } from '@features/SendAssets/components';
import { translateRaw } from '@translations';
import { bigify } from '@utils';

export const GasSchema = {
  gasLimitField: number()
    .min(GAS_LIMIT_LOWER_BOUND, translateRaw('ERROR_8'))
    .max(GAS_LIMIT_UPPER_BOUND, translateRaw('ERROR_8'))
    .required(translateRaw('REQUIRED'))
    .typeError(translateRaw('ERROR_8'))
    .test(validateGasLimitField()),
  gasPriceField: number()
    .min(GAS_PRICE_GWEI_LOWER_BOUND, translateRaw('LOW_GAS_PRICE_WARNING'))
    .max(GAS_PRICE_GWEI_UPPER_BOUND, translateRaw('ERROR_10'))
    .required(translateRaw('REQUIRED'))
    .typeError(translateRaw('GASPRICE_ERROR'))
    .test(validateGasPriceField()),
  maxFeePerGasField: number()
    .min(GAS_PRICE_GWEI_LOWER_BOUND, translateRaw('LOW_GAS_PRICE_WARNING'))
    .max(GAS_PRICE_GWEI_UPPER_BOUND, translateRaw('ERROR_10'))
    .required(translateRaw('REQUIRED'))
    .typeError(translateRaw('GASPRICE_ERROR'))
    .test(validateGasPriceField()),
  maxPriorityFeePerGasField: number()
    .min(GAS_PRICE_GWEI_LOWER_BOUND, translateRaw('LOW_GAS_PRICE_WARNING'))
    .max(GAS_PRICE_GWEI_UPPER_BOUND, translateRaw('ERROR_10'))
    .required(translateRaw('REQUIRED'))
    .typeError(translateRaw('GASPRICE_ERROR'))
    .test(validateGasPriceField())
    .test('check-max', translateRaw('PRIORITY_FEE_MAX_ERROR'), function (value) {
      const maxFeePerGas = this.parent.maxFeePerGasField;
      return bigify(maxFeePerGas).gte(value);
    })
};

export const useGasForm = <Values extends FormikValues = FormikValues>({
  validationSchema: passedValidationSchema,
  initialValues: passedInitialValues,
  onSubmit,
  ...formikConfig
}: FormikConfig<Values>) => {
  const validationSchema = passedValidationSchema.shape(GasSchema);
  const initialValues = ({
    ...passedInitialValues,
    gasPriceField: '20',
    maxFeePerGasField: '20',
    maxPriorityFeePerGasField: '1',
    gasLimitField: '21000'
  } as unknown) as Values;

  const { setFieldValue, ...formik } = useFormik({
    validationSchema,
    initialValues,
    onSubmit,
    ...formikConfig
  });

  const handleGasPriceChange = (value: string) => setFieldValue('gasPriceField', value);
  const handleGasLimitChange = (value: string) => setFieldValue('gasLimitField', value);
  const handleMaxFeeChange = (value: string) => setFieldValue('maxFeePerGasField', value);
  const handleMaxPriorityFeeChange = (value: string) =>
    setFieldValue('maxPriorityFeePerGasField', value);

  return {
    setFieldValue,
    handleGasPriceChange,
    handleGasLimitChange,
    handleMaxFeeChange,
    handleMaxPriorityFeeChange,
    ...formik
  };
};
