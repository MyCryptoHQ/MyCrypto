import React, { useContext } from 'react';

import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';
import styled from 'styled-components';

import { AccountSelector, Button, GasSelector, Typography } from '@components';
import {
  baseToConvertedUnit,
  hexToString,
  hexWeiToString,
  inputGasPriceToHex,
  StoreContext
} from '@services';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';
import { ITxConfig, Network, StoreAccount } from '@types';

import { getAccountsInNetwork } from '../helpers';
import { ABIItem } from '../types';

const WriteActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const AccountSelectorWrapper = styled.div`
  margin-top: 8px;
`;

const ActionButton = styled(Button)`
  margin-top: 18px;
  width: fit-content;
`;

const CustomLabel = styled(Typography)`
  font-size: 1em;
`;

interface Props {
  account: StoreAccount;
  network: Network;
  currentFunction: ABIItem;
  rawTransaction: ITxConfig;
  estimateGasCallProps: object;
  handleAccountSelected(account: StoreAccount): void;
  handleSubmit(submitedFunction: ABIItem): void;
  handleGasSelectorChange(payload: any): void;
}

export default function WriteForm(props: Props) {
  const {
    account,
    network,
    currentFunction,
    rawTransaction,
    estimateGasCallProps,
    handleAccountSelected,
    handleSubmit,
    handleGasSelectorChange
  } = props;

  const { gasPrice, gasLimit, nonce } = rawTransaction;

  const { accounts } = useContext(StoreContext);
  const filteredAccounts = getAccountsInNetwork(accounts, network.id);

  const handleGasPriceChange = (val: string) => {
    if (val.length) {
      val = hexWeiToString(inputGasPriceToHex(val));
      val = addHexPrefix(new BN(val).toString(16));
    }
    handleGasSelectorChange({ gasPrice: val } as ITxConfig);
  };

  const formatGasPrice = () =>
    gasPrice.length ? baseToConvertedUnit(hexToString(gasPrice), 9) : gasPrice;

  const handleGasLimitChange = (val: string) => {
    handleGasSelectorChange({ gasLimit: Number(val) });
  };

  const handleNonceChange = (val: string) => {
    handleGasSelectorChange({ nonce: Number(val) });
  };

  return (
    <WriteActionWrapper>
      <CustomLabel>{translateRaw('ACCOUNT')}</CustomLabel>
      <AccountSelectorWrapper>
        <AccountSelector
          name="account"
          value={account}
          accounts={filteredAccounts}
          onSelect={(option: StoreAccount) => {
            handleAccountSelected(option);
          }}
        />
        {account && (
          <GasSelector
            gasPrice={formatGasPrice()}
            gasLimit={gasLimit}
            nonce={nonce}
            account={account}
            setGasPrice={handleGasPriceChange}
            setGasLimit={handleGasLimitChange}
            setNonce={handleNonceChange}
            estimateGasCallProps={estimateGasCallProps}
          />
        )}
      </AccountSelectorWrapper>

      <ActionButton color={COLORS.WHITE} onClick={() => handleSubmit(currentFunction)}>
        {translateRaw('ACTION_17')}
      </ActionButton>
    </WriteActionWrapper>
  );
}
