import { useState } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikConfig, FormikValues, useFormik } from 'formik';
import { number, object } from 'yup';

import {
  GAS_LIMIT_LOWER_BOUND,
  GAS_LIMIT_UPPER_BOUND,
  GAS_PRICE_GWEI_LOWER_BOUND,
  GAS_PRICE_GWEI_UPPER_BOUND
} from '@config';
import { validateGasLimitField, validateGasPriceField } from '@features/SendAssets/components';
import { isEIP1559Supported } from '@helpers';
import {
  fetchEIP1559PriceEstimates,
  fetchGasPriceEstimates,
  getDefaultEstimates,
  getGasEstimate
} from '@services/ApiService/Gas';
import { translateRaw } from '@translations';
import { GasEstimates, ITxObject, Network, StoreAccount } from '@types';
import { bigify, bigNumGasPriceToViewableGwei } from '@utils';

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
  const validationSchema = (passedValidationSchema ?? object()).shape(GasSchema);
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

  const [isEstimatingGasPrice, setIsEstimatingGasPrice] = useState(false);
  const [isEstimatingGasLimit, setIsEstimatingGasLimit] = useState(false); // Used to indicate that interface is currently estimating gas.
  const [gasEstimationError, setGasEstimationError] = useState<string | undefined>(undefined);
  const [baseFee, setBaseFee] = useState<BigNumber | undefined>(undefined);
  const [legacyGasEstimates, setLegacyGasEstimates] = useState<GasEstimates>(getDefaultEstimates());

  const handleGasPriceEstimation = async (network: Network, account: StoreAccount) => {
    try {
      setIsEstimatingGasPrice(true);
      if (!isEIP1559Supported(network, account)) {
        const data = await fetchGasPriceEstimates(network);
        setLegacyGasEstimates(data);
        setFieldValue('gasPriceSlider', data.fast.toString());
        setFieldValue('gasPriceField', data.fast.toString());
      } else {
        const data = await fetchEIP1559PriceEstimates(network);
        setFieldValue(
          'maxFeePerGasField',
          data.maxFeePerGas && bigNumGasPriceToViewableGwei(data.maxFeePerGas)
        );
        setFieldValue(
          'maxPriorityFeePerGasField',
          data.maxPriorityFeePerGas && bigNumGasPriceToViewableGwei(data.maxPriorityFeePerGas)
        );
        setBaseFee(data.baseFee);
      }
    } catch (err) {
      console.error(err);
    }
    setIsEstimatingGasPrice(false);
  };

  const handleGasLimitEstimation = async (network: Network, tx: Partial<ITxObject>) => {
    setIsEstimatingGasLimit(true);
    try {
      const gas = await getGasEstimate(network, tx);
      setFieldValue('gasLimitField', gas);
      setGasEstimationError(undefined);
    } catch (err) {
      setGasEstimationError(err?.reason ?? err?.message);
    }
    setIsEstimatingGasLimit(false);
  };

  return {
    setFieldValue,
    handleGasPriceChange,
    handleGasLimitChange,
    handleMaxFeeChange,
    handleMaxPriorityFeeChange,
    handleGasPriceEstimation,
    handleGasLimitEstimation,
    isEstimatingGasPrice,
    isEstimatingGasLimit,
    gasEstimationError,
    baseFee,
    legacyGasEstimates,
    ...formik
  };
};
