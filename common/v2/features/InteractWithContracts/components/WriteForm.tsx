import React, { useContext } from 'react';

import styled from 'styled-components';
import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';

import { AccountDropdown, Button, Typography } from 'v2/components';
import { StoreAccount, NetworkId, ITxConfig } from 'v2/types';
import {
  StoreContext,
  hexToString,
  baseToConvertedUnit,
  inputGasPriceToHex,
  hexWeiToString
} from 'v2/services';

import { getAccountsInNetwork } from '../helpers';
import GasSelector from './GasSelector';
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
  font-size: 16px;
`;

interface Props {
  account: StoreAccount;
  networkId: NetworkId;
  currentFunction: ABIItem;
  rawTransaction: ITxConfig;
  isAutoGasSet: boolean;
  handleAccountSelected(account: StoreAccount): void;
  handleSubmit(submitedFunction: ABIItem): void;
  estimateGasHandle(forceEstimate?: boolean): Promise<void>;
  setIsAutoGasSet(value: boolean): void;
  handleGasSelectorChange(payload: ITxConfig): void;
}

export default function WriteForm(props: Props) {
  const {
    account,
    networkId,
    currentFunction,
    rawTransaction,
    isAutoGasSet,
    handleAccountSelected,
    handleSubmit,
    estimateGasHandle,
    setIsAutoGasSet,
    handleGasSelectorChange
  } = props;

  const { gasPrice, gasLimit, nonce } = rawTransaction;

  const { accounts } = useContext(StoreContext);
  const filteredAccounts = getAccountsInNetwork(accounts, networkId);

  const handleGasPriceChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let value = (e.target as HTMLTextAreaElement).value;
    if (value.length) {
      value = hexWeiToString(inputGasPriceToHex(value));
      value = addHexPrefix(new BN(value).toString(16));
    }
    handleGasSelectorChange({ gasPrice: value } as ITxConfig);
  };

  const formatGasPrice = () =>
    gasPrice.length ? baseToConvertedUnit(hexToString(gasPrice), 9) : gasPrice;

  const handleGasLimitChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleGasSelectorChange({ gasLimit: (e.target as HTMLTextAreaElement).value } as ITxConfig);
  };

  const handleNonceChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleGasSelectorChange({ nonce: (e.target as HTMLTextAreaElement).value } as ITxConfig);
  };

  return (
    <WriteActionWrapper>
      <CustomLabel>Account</CustomLabel>
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
            handleGasPriceChange={handleGasPriceChange}
            handleGasLimitChange={handleGasLimitChange}
            handleNonceChange={handleNonceChange}
            isAutoGasSet={isAutoGasSet}
            setIsAutoGasSet={setIsAutoGasSet}
            estimateGasHandle={estimateGasHandle}
          />
        )}
      </AccountDropdownWrapper>

      <ActionButton onClick={() => handleSubmit(currentFunction)}>Write</ActionButton>
    </WriteActionWrapper>
  );
}
