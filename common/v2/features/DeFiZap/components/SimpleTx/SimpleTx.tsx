import React, { useContext } from 'react';
import styled from 'styled-components';
import { Button, Typography, GasSelector, AccountDropdown } from 'v2/components';
import { translateRaw } from 'v2/translations';
import { StoreAccount } from 'v2/types/account';
import {
  baseToConvertedUnit,
  hexToString,
  inputGasPriceToHex,
  hexWeiToString
} from 'v2/services/EthService/utils';
import { addHexPrefix } from 'ethereumjs-util';
import { ITxConfig, Network } from 'v2/types';
import BN from 'bn.js';
import { getAccountsInNetwork } from 'v2/features/InteractWithContracts/helpers';
import { StoreContext } from 'v2/services/Store';
import { DEFAULT_NETWORK } from 'v2/config';

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
  rawTransaction: ITxConfig;
  estimateGasCallProps: object;
  handleAccountSelected(account: StoreAccount): void;
  handleGasSelectorChange(payload: any): void;
  handleSubmit(): void;
}

const SimpleTx = (props: Props) => {
  const {
    account,
    rawTransaction,
    estimateGasCallProps,
    handleAccountSelected,
    handleSubmit,
    handleGasSelectorChange
  } = props;

  const { gasPrice, gasLimit, nonce } = rawTransaction;

  const { accounts } = useContext(StoreContext);
  const filteredAccounts = getAccountsInNetwork(accounts, DEFAULT_NETWORK);

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
      <span>{JSON.stringify(rawTransaction, null, 2)}</span>
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

      <ActionButton onClick={() => handleSubmit()}>{translateRaw('ACTION_17')}</ActionButton>
    </WriteActionWrapper>
  );
};

export default SimpleTx;
