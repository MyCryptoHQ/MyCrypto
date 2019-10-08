import React from 'react';
import styled from 'styled-components';

import { AssetSelectDropdown } from './fields';
import { InputField } from 'v2/components';
import { Button } from '@mycrypto/ui';
import { ISwapAsset } from '../types';

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
  sendAmount: string;
  receiveAmount: string;
  asset: ISwapAsset;
  receiveAsset: ISwapAsset;
  assets: ISwapAsset[];
  goToNextStep(): void;
  setAsset(asset: ISwapAsset): void;
  setReceiveAsset(asset: ISwapAsset): void;
  setSendAmount(amount: string): void;
  setReceiveAmount(amount: string): void;
}

export default function SwapAssets(props: Props) {
  const {
    goToNextStep,
    setAsset,
    setReceiveAsset,
    setSendAmount,
    setReceiveAmount,
    sendAmount,
    receiveAmount,
    asset,
    receiveAsset,
    assets
  } = props;

  const handlAssetSelected = (selectedAsset: ISwapAsset) => {
    setAsset(selectedAsset);
  };

  const handlReceiveAssetSelected = (selectedAsset: ISwapAsset) => {
    setReceiveAsset(selectedAsset);
  };

  const handleSendAmountChange = (e: any) => {
    setSendAmount(e.target.value);
  };

  const handleReceiveAmountChange = (e: any) => {
    setReceiveAmount(e.target.value);
  };

  return (
    <FormWrapper>
      <FormItem>
        <AssetSelectDropdown
          selectedAsset={asset}
          assets={assets}
          onChange={handlAssetSelected}
          label="Select Asset"
          fluid={true}
        />
      </FormItem>
      <FormItem>
        <InputWrapper>
          <InputField
            label={'Send Amount'}
            value={sendAmount}
            placeholder="0.00"
            onChange={handleSendAmountChange}
            type="number"
            height={'54px'}
          />
        </InputWrapper>
        <AssetSelectDropdown
          selectedAsset={asset}
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
            value={receiveAmount}
            placeholder="0.00"
            onChange={handleReceiveAmountChange}
            type="number"
            height={'54px'}
          />
        </InputWrapper>
        <AssetSelectDropdown
          selectedAsset={receiveAsset}
          assets={assets}
          label="Asset"
          onChange={handlReceiveAssetSelected}
          showOnlyTicker={true}
        />
      </FormItem>
      <StyledButton onClick={goToNextStep}>Next</StyledButton>
    </FormWrapper>
  );
}
