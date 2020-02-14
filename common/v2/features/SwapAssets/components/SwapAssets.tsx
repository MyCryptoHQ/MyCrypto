import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button, Tooltip } from '@mycrypto/ui';

import translate, { translateRaw } from 'v2/translations';
import { MYC_COMMISSION } from 'v2/config';
import { InputField, AssetDropdown } from 'v2/components';

import { ISwapAsset } from '../types';
import { getUnselectedAssets } from '../helpers';
import questionToolTip from 'common/assets/images/icn-question.svg';

const FormWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 16px;
`;

const FormItem = styled.div`
  display: flex;
  width: 100%;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-right: 15px;
`;

const CenteredToolTip = styled(Tooltip)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.p`
  font-size: 18px;
  width: 100%;
  line-height: 1;
  text-align: left;
  font-weight: normal;
  margin-bottom: 9px;
  color: ${props => props.theme.text};
`;

const DisplayData = styled.p`
  margin-left: 12px;
`;

const StyledButton = styled(Button)`
  margin-top: 12px;
  width: 100%;
`;

const FormDisplay = styled.div`
  margin-bottom: 32px;
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
  initialValue: number;
  initialRate: number;
  slippageRate: number;
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
    handleToAmountChanged,
    initialValue,
    initialRate,
    slippageRate
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

  const makeDisplayString = (amount: number) =>
    amount.toFixed(2) === '0.00' || amount < 0 ? '<0.01' : amount.toFixed(2);

  return (
    <FormWrapper>
      <FormItem>
        <InputWrapper>
          <InputField
            label={'Swap From'}
            value={fromAmount}
            placeholder="0.00"
            onChange={handleFromAmountChangedEvent}
            height={'54px'}
            isLoading={isCalculatingFromAmount}
            inputError={fromAmountError}
          />
        </InputWrapper>
        <AssetDropdown
          selectedAsset={fromAsset}
          assets={filteredAssets}
          label={translateRaw('X_ASSET')}
          onSelect={handleFromAssetSelected}
          showOnlyTicker={true}
          disabled={isCalculatingToAmount || isCalculatingFromAmount}
          searchable={true}
        />
      </FormItem>
      <FormDisplay>
        {initialValue && toAmount && toAsset && (
          <>
            <Label>
              {`Fee (${MYC_COMMISSION}%) `}
              <CenteredToolTip tooltip={'This fee is split between MyCrypto and Dex.AG'}>
                <img src={questionToolTip} />
              </CenteredToolTip>{' '}
              :
            </Label>
            <DisplayData>
              {`${makeDisplayString(initialValue - parseFloat(toAmount))} ${toAsset.symbol}`}
            </DisplayData>
          </>
        )}
      </FormDisplay>
      <FormItem>
        <InputWrapper>
          <InputField
            label={'To'}
            value={toAmount}
            placeholder="0.00"
            onChange={handleToAmountChangedEvent}
            height={'54px'}
            isLoading={isCalculatingToAmount}
            inputError={toAmountError}
          />
        </InputWrapper>
        <AssetDropdown
          selectedAsset={toAsset}
          assets={filteredAssets}
          label={translateRaw('ASSET')}
          onSelect={handleToAssetSelected}
          showOnlyTicker={true}
          disabled={isCalculatingToAmount || isCalculatingFromAmount}
          searchable={true}
        />
      </FormItem>
      <FormDisplay>
        {initialRate && toAsset && fromAsset && (
          <>
            <Label>{`Rate: `}</Label>
            <DisplayData>
              {`${makeDisplayString(initialRate)} ${toAsset.symbol} per ${fromAsset.symbol}`}
            </DisplayData>
          </>
        )}
        {slippageRate && fromAsset && (
          <>
            <Label>
              {`Markup `}
              <CenteredToolTip
                tooltip={`Markup is calculated by comparing against a 0.01 ${fromAsset.symbol} trade`}
              >
                <img src={questionToolTip} />
              </CenteredToolTip>
              :
            </Label>
            <DisplayData>{`${makeDisplayString((1 - slippageRate) * 100)}%`}</DisplayData>
          </>
        )}
      </FormDisplay>
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
