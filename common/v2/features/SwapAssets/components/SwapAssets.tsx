import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { AssetSelectDropdown } from './fields';
import { InputField } from 'v2/components';
import { Button } from '@mycrypto/ui';
import { ISwapAsset, LAST_CHANGED_AMOUNT } from '../types';
import { DexService } from 'v2/services/ApiService/Dex';

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
  setLastChagedAmount(lastChangedAmount: any): void;
  goToNextStep(): void;
  setSwapPrice(amount: number): void;
  setFromAsset(asset: ISwapAsset): void;
  setToAsset(asset: ISwapAsset): void;
  setFromAmount(amount: string): void;
  setToAmount(amount: string): void;
}

let caculateToAmountTimeout: NodeJS.Timer | null = null;
let caculateFromAmountTimeout: NodeJS.Timer | null = null;

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

  // SEND AMOUNT CHANGED
  const handleFromAmountChanged = (e: any) => {
    const value = e.target.value;
    setLastChagedAmount(LAST_CHANGED_AMOUNT.FROM);
    setFromAmount(value);

    // Calculate new "to amount" 500 ms after user stopped typing
    if (caculateToAmountTimeout) clearTimeout(caculateToAmountTimeout);

    caculateToAmountTimeout = setTimeout(() => {
      calculateNewToAmount(value);
    }, 500);
  };

  // RECEIVE AMOUNT CHANGED
  const handleToAmountChanged = async (e: any) => {
    const value = e.target.value;
    setLastChagedAmount(LAST_CHANGED_AMOUNT.TO);
    setToAmount(value);

    // Calculate new "from amount" 500 ms after user stopped typing
    if (caculateFromAmountTimeout) clearTimeout(caculateFromAmountTimeout);
    caculateFromAmountTimeout = setTimeout(() => {
      calculateNewFromAmount(value);
    }, 500);
  };

  const calculateNewToAmount = async (value: number) => {
    if (!fromAsset || !toAsset) {
      return;
    }

    try {
      setIsCalculatingToAmount(true);
      const price = await DexService.instance.getTokenPriceFrom(
        fromAsset.symbol,
        toAsset.symbol,
        value
      );

      setSwapPrice(price);
      setToAmount((value * price).toString());
      setIsCalculatingToAmount(false);
    } catch (e) {
      clearAmounts();
      setIsCalculatingToAmount(false);
      console.error(e);
    }
  };

  const calculateNewFromAmount = async (value: number) => {
    if (!fromAsset || !toAsset) {
      return;
    }

    try {
      setIsCalculatingFromAmount(true);
      const price = await DexService.instance.getTokenPriceTo(
        fromAsset.symbol,
        toAsset.symbol,
        value
      );

      setSwapPrice(price);
      setFromAmount((value * price).toString());
      setIsCalculatingFromAmount(false);
    } catch (e) {
      clearAmounts();
      setIsCalculatingFromAmount(false);
      console.error(e);
    }
  };

  const handlFromAssetSelected = (selectedAsset: ISwapAsset) => {
    if (isCalculatingFromAmount || isCalculatingToAmount) {
      return;
    }
    setFromAsset(selectedAsset);
    clearAmounts();
  };

  const handlToAssetSelected = (selectedAsset: ISwapAsset) => {
    setToAsset(selectedAsset);
  };

  const clearAmounts = () => {
    setFromAmount('');
    setToAmount('');
  };

  // Calculate new "to amount" after "to asset" is selected
  useEffect(() => {
    if (!fromAmount) {
      return;
    }
    calculateNewToAmount(Number(fromAmount));
    setLastChagedAmount(LAST_CHANGED_AMOUNT.FROM);
  }, [toAsset]);

  return (
    <FormWrapper>
      <FormItem>
        <AssetSelectDropdown
          selectedAsset={fromAsset}
          assets={assets}
          onChange={handlFromAssetSelected}
          label="Select Asset"
          fluid={true}
        />
      </FormItem>
      <FormItem>
        <InputWrapper>
          <InputField
            label={'Send Amount'}
            value={fromAmount}
            placeholder="0.00"
            onChange={handleFromAmountChanged}
            type="number"
            height={'54px'}
            isLoading={isCalculatingFromAmount}
          />
        </InputWrapper>
        <AssetSelectDropdown
          selectedAsset={fromAsset}
          assets={assets}
          label="Asset"
          showOnlyTicker={true}
          disabled={true}
        />
      </FormItem>
      <FormItem>
        <InputWrapper>
          <InputField
            label={'Receive Amount'}
            value={toAmount}
            placeholder="0.00"
            onChange={handleToAmountChanged}
            type="number"
            height={'54px'}
            isLoading={isCalculatingToAmount}
          />
        </InputWrapper>
        <AssetSelectDropdown
          selectedAsset={toAsset}
          assets={assets}
          label="Asset"
          onChange={handlToAssetSelected}
          showOnlyTicker={true}
          disabled={isCalculatingToAmount || isCalculatingFromAmount}
        />
      </FormItem>
      <StyledButton
        onClick={goToNextStep}
        disabled={isCalculatingToAmount || isCalculatingFromAmount}
      >
        Next
      </StyledButton>
    </FormWrapper>
  );
}
