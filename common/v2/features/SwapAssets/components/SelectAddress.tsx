import React from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { SwapFromToDiagram, AddressSelector } from './fields';
import { ISwapAsset } from '../types';

const StyledButton = styled(Button)`
  margin-top: 12px;
  width: 100%;
`;
interface Props {
  sendAddressManuallySelected: boolean;
  receiveAddressManuallySelected: boolean;
  sendAddress: string;
  receiveAddress: string;
  asset: ISwapAsset;
  receiveAsset: ISwapAsset;
  sendAmount: string;
  receiveAmount: string;
  setSendAddress(address: string): void;
  setReceiveAddress(address: string): void;
  setSendAddressManuallySelected(manuallySelected: boolean): void;
  setReceiveAddressManuallySelected(manuallySelected: boolean): void;
  goToNextStep(): void;
}

export default function SelectAddress(props: Props) {
  const {
    goToNextStep,
    sendAddressManuallySelected,
    receiveAddressManuallySelected,
    setSendAddressManuallySelected,
    setReceiveAddressManuallySelected,
    sendAddress,
    receiveAddress,
    setSendAddress,
    setReceiveAddress,
    asset,
    receiveAsset,
    sendAmount,
    receiveAmount
  } = props;

  return (
    <div>
      <SwapFromToDiagram
        fromSymbol={asset.symbol}
        toSymbol={receiveAsset.symbol}
        fromAmount={sendAmount}
        toAmount={receiveAmount}
      />
      <AddressSelector
        label={'Add Sender Address'}
        address={sendAddress}
        addressManuallySelected={sendAddressManuallySelected}
        setAddressManuallySelected={setSendAddressManuallySelected}
        onAddressChanged={setSendAddress}
      />
      <AddressSelector
        label={'Add Receiver Address'}
        address={receiveAddress}
        addressManuallySelected={receiveAddressManuallySelected}
        setAddressManuallySelected={setReceiveAddressManuallySelected}
        onAddressChanged={setReceiveAddress}
      />
      <StyledButton onClick={goToNextStep}>Next</StyledButton>
    </div>
  );
}
