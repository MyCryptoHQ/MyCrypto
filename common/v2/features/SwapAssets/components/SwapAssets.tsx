import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate, { translateRaw } from 'v2/translations';

import { InputField } from 'v2/components';

import { ISwapAsset } from '../types';
import { AssetSelectDropdown } from './fields';
import { getUnselectedAssets } from '../helpers';

const FormWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 16px;
`;

const FormItem = styled.div`
  margin-bottom: 12px;
  display: flex;
  width: 100%;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-right: 15px;
`;

const StyledButton = styled(Button)`
  margin-top: 12px;
  width: 100%;
`;

interface Props {
  fromAmount: string;
  toAmount: string;
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  assets: ISwapAsset[];
  isCalculatingFromAmount: boolean;
  isCalculatingToAmount: boolean;
  fromAmountError: string;
  toAmountError: string;
  onSuccess(): void;
  handleFromAssetSelected(asset: ISwapAsset): void;
  handleToAssetSelected(asset: ISwapAsset): void;
  calculateNewFromAmount(value: string): Promise<void>;
  calculateNewToAmount(value: string): Promise<void>;
  handleFromAmountChanged(value: string): void;
  handleToAmountChanged(value: string): void;
}

let calculateToAmountTimeout: ReturnType<typeof setTimeout> | null = null;
let calculateFromAmountTimeout: ReturnType<typeof setTimeout> | null = null;

export default function SwapAssets(props: Props) {
  const {
    fromAmount,
    toAmount,
    fromAsset,
    toAsset,
    assets,
    isCalculatingFromAmount,
    isCalculatingToAmount,
    fromAmountError,
    toAmountError,
    onSuccess,
    handleFromAssetSelected,
    handleToAssetSelected,
    calculateNewFromAmount,
    calculateNewToAmount,
    handleFromAmountChanged,
    handleToAmountChanged
  } = props;

  // show only unused assets
  const filteredAssets = getUnselectedAssets(assets, fromAsset, toAsset);

  // SEND AMOUNT CHANGED
  const handleFromAmountChangedEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleFromAmountChanged(value);

    // Calculate new "to amount" 500 ms after user stopped typing
    if (calculateToAmountTimeout) clearTimeout(calculateToAmountTimeout);

    calculateToAmountTimeout = setTimeout(() => {
      calculateNewToAmount(value);
    }, 500);
  };

  // RECEIVE AMOUNT CHANGED
  const handleToAmountChangedEvent = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleToAmountChanged(value);

    // Calculate new "from amount" 500 ms after user stopped typing
    if (calculateFromAmountTimeout) clearTimeout(calculateFromAmountTimeout);
    calculateFromAmountTimeout = setTimeout(() => {
      calculateNewFromAmount(value);
    }, 500);
  };

  // Calculate new "to amount" after "to asset" is selected
  useEffect(() => {
    if (!fromAmount) {
      return;
    }

    calculateNewToAmount(fromAmount);
  }, [toAsset]);

  return (
    <FormWrapper>
      <FormItem>
        <AssetSelectDropdown
          selectedAsset={fromAsset}
          assets={filteredAssets}
          onChange={handleFromAssetSelected}
          label={translateRaw('SWAP_SELECT_ASSET')}
          fluid={true}
        />
      </FormItem>
      <FormItem>
        <InputWrapper>
          <InputField
            label={translateRaw('FORM_SEND_AMOUNT')}
            value={fromAmount}
            placeholder="0.00"
            onChange={handleFromAmountChangedEvent}
            height={'54px'}
            isLoading={isCalculatingFromAmount}
            inputError={fromAmountError}
          />
        </InputWrapper>
        <AssetSelectDropdown
          selectedAsset={fromAsset}
          assets={filteredAssets}
          label={translateRaw('ASSET')}
          showOnlyTicker={true}
          disabled={true}
        />
      </FormItem>
      <FormItem>
        <InputWrapper>
          <InputField
            label={translate('SWAP_RECEIVE_AMOUNT')}
            value={toAmount}
            placeholder="0.00"
            onChange={handleToAmountChangedEvent}
            height={'54px'}
            isLoading={isCalculatingToAmount}
            inputError={toAmountError}
          />
        </InputWrapper>
        <AssetSelectDropdown
          selectedAsset={toAsset}
          assets={filteredAssets}
          label={translateRaw('ASSET')}
          onChange={handleToAssetSelected}
          showOnlyTicker={true}
          disabled={isCalculatingToAmount || isCalculatingFromAmount}
        />
      </FormItem>
      <StyledButton
        onClick={onSuccess}
        disabled={
          isCalculatingToAmount ||
          isCalculatingFromAmount ||
          !fromAmount ||
          !toAmount ||
          !!fromAmountError ||
          !!toAmountError
        }
      >
        {translate('ACTION_6')}
      </StyledButton>
    </FormWrapper>
  );
}
