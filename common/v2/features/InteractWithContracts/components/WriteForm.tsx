import React, { useContext } from 'react';

import styled from 'styled-components';
import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';

import { AccountDropdown, Button, Typography, GasSelector } from '@components';
import { StoreAccount, ITxConfig, Network } from '@types';
import {
  StoreContext,
  hexToString,
  baseToConvertedUnit,
  inputGasPriceToHex,
  hexWeiToString
} from '@services';
import { translateRaw } from '@translations';
import { COLORS } from '@theme';

import { getAccountsInNetwork } from '../helpers';
import { ABIItem } from '../types';

const WriteActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const AccountDropdownWrapper = styled.div`
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
      <AccountDropdownWrapper>
        <AccountDropdown
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
      </AccountDropdownWrapper>

      <ActionButton color={COLORS.WHITE} onClick={() => handleSubmit(currentFunction)}>
        {translateRaw('ACTION_17')}
      </ActionButton>
    </WriteActionWrapper>
  );
}
