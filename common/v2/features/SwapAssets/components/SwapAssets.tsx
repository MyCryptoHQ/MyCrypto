import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { AssetSelectDropdown } from './fields';
import { InputField } from 'v2/components';
import { ISwapAsset, LAST_CHANGED_AMOUNT } from '../types';
import { DexService } from 'v2/services/ApiService';
import { translate, translateRaw } from 'translations';

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
  setLastChagedAmount(lastChangedAmount: LAST_CHANGED_AMOUNT): void;
  goToNextStep(): void;
  setSwapPrice(amount: number): void;
  setFromAsset(asset: ISwapAsset): void;
  setToAsset(asset: ISwapAsset): void;
  setFromAmount(amount: string): void;
  setToAmount(amount: string): void;
}

let calculateToAmountTimeout: NodeJS.Timer | null = null;
let calculateFromAmountTimeout: NodeJS.Timer | null = null;

export default function SwapAssets(props: Props) {
  const {
    goToNextStep,
    setFromAsset,
    setToAsset,
    setFromAmount,
    setToAmount,
    fromAmount,
    toAmount,
    fromAsset,
    toAsset,
    assets,
    setLastChagedAmount,
    setSwapPrice
  } = props;

  const [isCalculatingFromAmount, setIsCalculatingFromAmount] = useState(false);
  const [isCalculatingToAmount, setIsCalculatingToAmount] = useState(false);
  const [fromAmountError, setFromAmountError] = useState();
  const [toAmountError, setToAmountError] = useState();

  // show only unused assets
  const filteredAssets =
    !toAsset || !fromAsset
      ? assets
      : assets.filter(x => fromAsset.symbol !== x.symbol && toAsset.symbol !== x.symbol);

  // SEND AMOUNT CHANGED
  const handleFromAmountChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLastChagedAmount(LAST_CHANGED_AMOUNT.FROM);
    setFromAmount(value);

    // Calculate new "to amount" 500 ms after user stopped typing
    if (calculateToAmountTimeout) clearTimeout(calculateToAmountTimeout);

    calculateToAmountTimeout = setTimeout(() => {
      calculateNewToAmount(value);
    }, 500);
    clearErrors();
  };

  // RECEIVE AMOUNT CHANGED
  const handleToAmountChanged = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLastChagedAmount(LAST_CHANGED_AMOUNT.TO);
    setToAmount(value);

    // Calculate new "from amount" 500 ms after user stopped typing
    if (calculateFromAmountTimeout) clearTimeout(calculateFromAmountTimeout);
    calculateFromAmountTimeout = setTimeout(() => {
      calculateNewFromAmount(value);
    }, 500);
    clearErrors();
  };

  const calculateNewToAmount = async (value: string) => {
    if (!fromAsset || !toAsset) {
      return;
    }

    try {
      setIsCalculatingToAmount(true);
      const price = Number(
        await DexService.instance.getTokenPriceFrom(fromAsset.symbol, toAsset.symbol, value)
      );

      clearErrors();
      setSwapPrice(price);
      setToAmount((Number(value) * price).toString());
      setIsCalculatingToAmount(false);
    } catch (e) {
      if (!e.isCancel) {
        setFromAmountError(translateRaw('INVALID_AMOUNT_ERROR'));

        setIsCalculatingToAmount(false);
        console.error(e);
      }
    }
  };

  const calculateNewFromAmount = async (value: string) => {
    if (!fromAsset || !toAsset) {
      return;
    }

    try {
      setIsCalculatingFromAmount(true);
      const price = Number(
        await DexService.instance.getTokenPriceTo(fromAsset.symbol, toAsset.symbol, value)
      );

      clearErrors();
      setSwapPrice(price);
      setFromAmount((Number(value) * price).toString());
      setIsCalculatingFromAmount(false);
    } catch (e) {
      if (!e.isCancel) {
        setToAmountError(translateRaw('INVALID_AMOUNT_ERROR'));

        setIsCalculatingFromAmount(false);
        console.error(e);
      }
    }
  };

  const handleFromAssetSelected = (selectedAsset: ISwapAsset) => {
    if (isCalculatingFromAmount || isCalculatingToAmount) {
      return;
    }
    setFromAsset(selectedAsset);
    clearAmounts();
    clearErrors();
  };

  const clearAmounts = () => {
    setFromAmount('');
    setToAmount('');
  };

  const clearErrors = () => {
    if (fromAmountError || toAmountError) {
      setFromAmountError('');
      setToAmountError('');
    }
  };

  // Calculate new "to amount" after "to asset" is selected
  useEffect(() => {
    if (!fromAmount) {
      return;
    }
    calculateNewToAmount(fromAmount);
    setLastChagedAmount(LAST_CHANGED_AMOUNT.FROM);
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
            onChange={handleFromAmountChanged}
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
            onChange={handleToAmountChanged}
            height={'54px'}
            isLoading={isCalculatingToAmount}
            inputError={toAmountError}
          />
        </InputWrapper>
        <AssetSelectDropdown
          selectedAsset={toAsset}
          assets={filteredAssets}
          label={translateRaw('ASSET')}
          onChange={setToAsset}
          showOnlyTicker={true}
          disabled={isCalculatingToAmount || isCalculatingFromAmount}
        />
      </FormItem>
      <StyledButton
        onClick={goToNextStep}
        disabled={
          isCalculatingToAmount ||
          isCalculatingFromAmount ||
          !fromAmount ||
          !toAmount ||
          fromAmountError ||
          toAmountError
        }
      >
        {translate('ACTION_6')}
      </StyledButton>
    </FormWrapper>
  );
}
