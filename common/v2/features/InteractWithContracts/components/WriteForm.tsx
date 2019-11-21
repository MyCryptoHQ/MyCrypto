import React, { useContext, useState } from 'react';

import styled from 'styled-components';

import { AccountDropdown, Button, Typography } from 'v2/components';
import { StoreAccount, NetworkId } from 'v2/types';
import { StoreContext } from 'v2/services';
import { COLORS } from 'v2/theme';

import { getAccountsInNetwork } from '../helpers';
import GasSelector from './GasSelector';
import { ABIItem } from '../types';

const { LIGHT_GREY } = COLORS;

const WriteActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HorizontalLine = styled.div`
  height: 1px;
  color: #000;
  background-color: ${LIGHT_GREY};
  width: 100%;
  margin: 20px 0;
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
  handleAccountSelected(account: StoreAccount): void;
  handleSubmit(submitedFunction: ABIItem): void;
}

export default function WriteForm(props: Props) {
  const { account, networkId, currentFunction, handleAccountSelected, handleSubmit } = props;

  const [gasPrice, setGasPrice] = useState('10');
  const [gasLimit, setGasLimit] = useState('21000');
  const [nonce, setNonce] = useState('25');

  const { accounts } = useContext(StoreContext);
  const filteredAccounts = getAccountsInNetwork(accounts, networkId);

  const handleGasPriceChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setGasPrice((e.target as HTMLTextAreaElement).value);
  };

  const handleGasLimitChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setGasLimit((e.target as HTMLTextAreaElement).value);
  };

  const handleNonceChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setNonce((e.target as HTMLTextAreaElement).value);
  };

  return (
    <WriteActionWrapper>
      <HorizontalLine />
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
            gasPrice={gasPrice}
            gasLimit={gasLimit}
            nonce={nonce}
            handleGasPriceChange={handleGasPriceChange}
            handleGasLimitChange={handleGasLimitChange}
            handleNonceChange={handleNonceChange}
          />
        )}
      </AccountDropdownWrapper>

      <ActionButton onClick={() => handleSubmit(currentFunction)}>Write</ActionButton>
    </WriteActionWrapper>
  );
}
