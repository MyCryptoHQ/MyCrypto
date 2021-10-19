import React, { useState } from 'react';

import BigNumber from 'bignumber.js';

import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { GasLimitField, GasPriceField } from '@features/SendAssets/components';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';
import { Asset, Fiat } from '@types';
import { calculateMinMaxFee } from '@utils';

import Box from './Box';
import { default as Currency } from './Currency';
import { default as Icon } from './Icon';
import { default as LinkApp } from './LinkApp';
import { Body } from './NewTypography';
import Tooltip from './Tooltip';

interface Props {
  baseAsset: Asset;
  fiat: Fiat;
  // Current Base Fee of the network
  baseFee?: BigNumber;
  baseAssetRate: string | number;
  gasLimit: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  isEstimatingGasLimit: boolean;
  isEstimatingGasPrice: boolean;
  label?: string;
  disabled?: boolean;
  gasLimitError?: string;
  maxFeePerGasError?: string;
  maxPriorityFeePerGasError?: string;
  setGasLimit(value: string): void;
  setMaxFeePerGas(value: string): void;
  setMaxPriorityFeePerGas(value: string): void;
  handleGasPriceEstimation(): void;
  handleGasLimitEstimation(): void;
}

export const TransactionFeeEIP1559 = ({
  baseAsset,
  fiat,
  baseFee,
  baseAssetRate,
  gasLimit,
  maxFeePerGas,
  maxPriorityFeePerGas,
  label = translateRaw('CONFIRM_TX_FEE'),
  disabled,
  setGasLimit,
  setMaxFeePerGas,
  setMaxPriorityFeePerGas,
  gasLimitError,
  maxFeePerGasError,
  maxPriorityFeePerGasError,
  handleGasPriceEstimation,
  handleGasLimitEstimation,
  isEstimatingGasLimit,
  isEstimatingGasPrice
}: Props) => {
  const [editMode, setEditMode] = useState(false);
  const handleToggleEditMode = () => setEditMode(!editMode);

  const {
    viewableBaseFee,
    minFee,
    minFeeFiat,
    avgFee,
    avgFeeFiat,
    maxFee,
    maxFeeFiat,
    hasFiatValue
  } = calculateMinMaxFee({ baseFee, baseAssetRate, maxFeePerGas, maxPriorityFeePerGas, gasLimit });

  return (
    <Box opacity={disabled ? '0.5' : undefined}>
      <Box variant="rowAlign" justifyContent="space-between" mb="2">
        <Box>{label}</Box>
        {!disabled && (
          <>
            {editMode ? (
              <LinkApp href="#" isExternal={false} onClick={handleToggleEditMode}>
                <Body data-testid="save" as="span">
                  {translateRaw('SAVE_EDITS')}
                </Body>
              </LinkApp>
            ) : (
              <LinkApp href={getKBHelpArticle(KB_HELP_ARTICLE.WHAT_IS_EIP1559)} isExternal={true}>
                <Body as="span">{translateRaw('LEARN_WHATS_NEW_WITH_EIP1559')}</Body>
                <Icon ml="1" width="12px" height="12px" type="link-out" />
              </LinkApp>
            )}
          </>
        )}
      </Box>
      <Box
        bg={!disabled ? 'BG_GRAY' : undefined}
        border={disabled ? `1px solid ${COLORS.GREY_LIGHTER}` : undefined}
        borderRadius="2px"
        p="3"
      >
        {editMode && (
          <Box>
            <Box variant="rowAlign">
              <Body mb="0" fontWeight="bold">
                {translateRaw('CURRENT_BASE_FEE', {
                  $fee: viewableBaseFee ? viewableBaseFee.toString(10) : '?'
                })}
              </Body>
              <Tooltip ml="1" tooltip={translateRaw('BASE_FEE_TOOLTIP')} />
            </Box>
            <hr />
            <Box display="flex" alignItems="flex-start">
              <Box flex="50%">
                <GasPriceField
                  name="maxFeePerGasField"
                  onChange={setMaxFeePerGas}
                  value={maxFeePerGas}
                  error={maxFeePerGasError}
                  label={translateRaw('MAX_FEE_PER_GAS')}
                  tooltip={translateRaw('MAX_FEE_TOOLTIP')}
                  refresh={handleGasPriceEstimation}
                  disabled={isEstimatingGasPrice}
                />
              </Box>
              <Box px="3">
                <Body mt="40px" mb="0" fontWeight="bold">
                  X
                </Body>
              </Box>
              <Box flex="50%">
                <GasLimitField
                  name="gasLimitField"
                  onChange={setGasLimit}
                  value={gasLimit}
                  error={gasLimitError}
                  disabled={isEstimatingGasLimit}
                  label={translateRaw('GAS_LIMIT')}
                  tooltip={translateRaw('GAS_LIMIT_TOOLTIP_2')}
                  refresh={handleGasLimitEstimation}
                />
              </Box>
            </Box>
            <Box width="49%" pr="16px">
              <GasPriceField
                name="maxPriorityFeePerGasField"
                onChange={setMaxPriorityFeePerGas}
                value={maxPriorityFeePerGas}
                error={maxPriorityFeePerGasError}
                placeholder="1"
                label={translateRaw('MAX_PRIORITY_FEE')}
                tooltip={translateRaw('PRIORITY_FEE_TOOLTIP')}
                refresh={handleGasPriceEstimation}
                disabled={isEstimatingGasPrice}
              />
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
                  amount={avgFeeFiat.toString(10)}
                  symbol={fiat.symbol}
                  ticker={fiat.ticker}
                  decimals={2}
                />
              ) : (
                <Currency bold={true} amount={avgFee.toString(10)} ticker={baseAsset.ticker} />
              )}{' '}
              {!editMode && !disabled && (
                <LinkApp href="#" isExternal={false} onClick={handleToggleEditMode}>
                  <Icon data-testid="edit" ml="1" size="16px" type="edit" color="BLUE_SKY" />
                </LinkApp>
              )}
            </Body>
            <Body mt="1" mb="0" color="BLUE_GREY">
              {translateRaw('CUSTOMIZED_TOTAL_FEE')}{' '}
              {hasFiatValue && `(${avgFee.toFixed(6)} ${baseAsset.ticker})`}
            </Body>
          </Box>
          <Box>
            <Body mb="0" fontWeight="bold" color="GREYISH_BROWN" textAlign="right" fontSize="2">
              {hasFiatValue ? (
                <Currency bold={true} amount={minFeeFiat.toString(10)} decimals={2} />
              ) : (
                <Currency bold={true} amount={minFee.toString(10)} />
              )}
              {' - '}
              {hasFiatValue ? (
                <Currency
                  bold={true}
                  amount={maxFeeFiat.toString(10)}
                  symbol={fiat.symbol}
                  ticker={fiat.ticker}
                  decimals={2}
                />
              ) : (
                <Currency bold={true} amount={maxFee.toString(10)} ticker={baseAsset.ticker} />
              )}
            </Body>
            <Body mt="1" mb="0" color="BLUE_GREY" textAlign="right">
              {translateRaw('FEE_RANGE_ESTIMATE')}
            </Body>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
