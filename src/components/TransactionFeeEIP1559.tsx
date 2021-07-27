import { ChangeEvent, useState } from 'react';

import { BigNumber } from '@ethersproject/bignumber';

import { translateRaw } from '@translations';
import { Asset, Fiat } from '@types';
import { bigNumGasPriceToViewableGwei, gasStringsToMaxGasNumber } from '@utils';

import Box from './Box';
import { default as Currency } from './Currency';
import { default as Icon } from './Icon';
import InputField from './InputField';
import { default as LinkApp } from './LinkApp';
import { Body } from './NewTypography';

interface Props {
  baseAsset: Asset;
  fiat: Fiat;
  // Current Base Fee of the network
  baseFee?: BigNumber | null;
  baseAssetRate: string;
  gasLimit: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  setGasLimit(value: string): void;
  setMaxFeePerGas(value: string): void;
  setMaxPriorityFeePerGas(value: string): void;
}

export const TransactionFeeEIP1559 = ({
  baseAsset,
  fiat,
  baseFee,
  baseAssetRate,
  gasLimit,
  maxFeePerGas,
  maxPriorityFeePerGas,
  setGasLimit,
  setMaxFeePerGas,
  setMaxPriorityFeePerGas
}: Props) => {
  const [editMode, setEditMode] = useState(false);
  const handleGasLimitChange = (e: ChangeEvent<HTMLInputElement>) => setGasLimit(e.target.value);
  const handleMaxFeeChange = (e: ChangeEvent<HTMLInputElement>) => setMaxFeePerGas(e.target.value);
  const handleMaxPriorityFeeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setMaxPriorityFeePerGas(e.target.value);
  const handleToggleEditMode = () => setEditMode(!editMode);

  const totalFee = gasStringsToMaxGasNumber(maxFeePerGas, gasLimit);
  const totalFiat = totalFee.multipliedBy(baseAssetRate);
  const hasFiatValue = totalFiat.gt(0);

  return (
    <Box bg="BG_GRAY" p="3">
      {editMode && (
        <Box>
          <Box variant="rowAlign" justifyContent="space-between">
            <Body mb="0" fontWeight="bold">
              {translateRaw('EDIT_TRANSACTION_FEE')}
            </Body>
            <Body mb="0" fontWeight="bold">
              {translateRaw('CURRENT_BASE_FEE', {
                $fee: baseFee ? bigNumGasPriceToViewableGwei(baseFee) : '?'
              })}
            </Body>
          </Box>
          <hr />
          <Box variant="rowAlign">
            <Box flexGrow={1}>
              {translateRaw('GAS_LIMIT')}
              <InputField onChange={handleGasLimitChange} value={gasLimit} />
            </Box>
            <Box px="3">
              <Body mb="0" fontWeight="bold">
                X
              </Body>
            </Box>
            <Box flexGrow={1}>
              {translateRaw('MAX_FEE_PER_GAS')}
              <InputField onChange={handleMaxFeeChange} value={maxFeePerGas} />
            </Box>
          </Box>
          <Box width="45%">
            {translateRaw('MAX_PRIORITY_FEE')}
            <InputField onChange={handleMaxPriorityFeeChange} value={maxPriorityFeePerGas} />
          </Box>

          <hr />
        </Box>
      )}
      <Box variant="rowAlign" justifyContent="space-between">
        <Box>
          <Body mb="0" fontWeight="bold" color="GREYISH_BROWN" fontSize="3">
            {hasFiatValue ? (
              <Currency
                bold={true}
                amount={totalFiat.toString()}
                symbol={fiat.symbol}
                ticker={fiat.ticker}
                decimals={2}
              />
            ) : (
              <Currency bold={true} amount={totalFee.toString()} ticker={baseAsset.ticker} />
            )}{' '}
            <LinkApp href="#" isExternal={false} onClick={handleToggleEditMode}>
              {editMode ? (
                <Body as="span">{translateRaw('SAVE')}</Body>
              ) : (
                <Icon ml="1" size="16px" type="edit" color="BLUE_SKY" />
              )}
            </LinkApp>
          </Body>
          <Body mt="1" mb="0" color="BLUE_GREY">
            {translateRaw('RECOMMENDED_TOTAL_FEE')}
          </Body>
        </Box>
        <Box>
          {/* @todo Figure out what values to use for range */}
          <Body mb="0" fontWeight="bold" color="GREYISH_BROWN" textAlign="right" fontSize="2">
            {hasFiatValue ? (
              <Currency bold={true} amount={totalFiat.toString()} decimals={2} />
            ) : (
              <Currency bold={true} amount={totalFee.toString()} />
            )}
            {' - '}
            {hasFiatValue ? (
              <Currency
                bold={true}
                amount={totalFiat.toString()}
                symbol={fiat.symbol}
                ticker={fiat.ticker}
                decimals={2}
              />
            ) : (
              <Currency bold={true} amount={totalFee.toString()} ticker={baseAsset.ticker} />
            )}
          </Body>
          <Body mt="1" mb="0" color="BLUE_GREY">
            {translateRaw('FEE_RANGE_ESTIMATE')}
          </Body>
        </Box>
      </Box>
    </Box>
  );
};
