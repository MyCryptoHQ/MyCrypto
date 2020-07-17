import React, { useContext } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate from '@translations';

import { StoreAccount, TAddress } from '@types';
import { COLORS } from '@theme';
import { Typography, Currency } from '@components';
import { FromToAccount, SwapFromToDiagram } from '@components/TransactionFlow/displays';
import { AddressBookContext } from '@services';
import { isSameAddress } from '@utils';

import { IAssetPair } from '../types';

const StyledButton = styled(Button)`
  margin-top: 28px;
  width: 100%;
`;

const ConversionRateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.GREY_LIGHTEST};
  font-size: 20px;
  font-weight: bold;
  height: 150px;
`;

const ConversionLabel = styled(Typography)`
  color: ${COLORS.GREY};
`;

interface Props {
  assetPair: IAssetPair;
  account: StoreAccount;
  isSubmitting: boolean;
  onClick(): void;
}

export default function ConfirmSwap({
  assetPair,
  account,
  isSubmitting,
  onClick: onSuccess
}: Props) {
  const { fromAsset, toAsset, fromAmount, toAmount, rate: exchangeRate } = assetPair;
  const { addressBook } = useContext(AddressBookContext);
  const fromAddressBookEntry = addressBook.find(
    ({ address, network }) =>
      isSameAddress(address as TAddress, account.address) && network === account.networkId
  );
  return (
    <div>
      <SwapFromToDiagram
        fromSymbol={fromAsset.symbol}
        toSymbol={toAsset.symbol}
        fromUUID={fromAsset.uuid}
        toUUID={toAsset.uuid}
        fromAmount={fromAmount.toString(10)}
        toAmount={toAmount.toString(10)}
      />
      <FromToAccount
        fromAccount={{
          address: account.address,
          addressBookEntry: fromAddressBookEntry
        }}
        toAccount={{
          address: account.address,
          addressBookEntry: fromAddressBookEntry
        }}
        networkId={account.networkId}
      />
      <ConversionRateBox>
        <ConversionLabel bold={true} value={translate('SWAP_RATE')} fontSize="0.65em" />
        <div>
          <Currency bold={true} fontSize="1em" amount="1" symbol={fromAsset.symbol} decimals={6} />{' '}
          ≈{' '}
          <Currency
            bold={true}
            fontSize="1em"
            amount={exchangeRate.toString(10)}
            symbol={toAsset.symbol}
            decimals={8}
          />
        </div>
      </ConversionRateBox>
      <StyledButton onClick={onSuccess}>
        {isSubmitting ? translate('SUBMITTING') : translate('CONFIRM_AND_SEND')}
      </StyledButton>
    </div>
  );
}
