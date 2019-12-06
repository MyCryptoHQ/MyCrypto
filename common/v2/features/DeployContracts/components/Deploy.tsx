import React, { useState, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';
import { debounce } from 'lodash';

import {
  NetworkSelectDropdown,
  InputField,
  Button,
  InlineErrorMsg,
  AccountDropdown,
  Typography,
  GasSelector
} from 'v2/components';
import { NetworkId, StoreAccount, ITxConfig } from 'v2/types';
import { translateRaw } from 'v2/translations';
import {
  StoreContext,
  inputGasPriceToHex,
  hexWeiToString,
  hexToString,
  baseToConvertedUnit
} from 'v2/services';

import { getAccountsInNetwork, constructGasCallProps } from '../helpers';

const NetworkSelectorWrapper = styled.div`
  margin-bottom: 12px;
  label {
    font-weight: normal;
  }
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  flex: 1;
  p {
    font-size: 1em;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: left;
`;

const ErrorWrapper = styled.div`
  margin-bottom: 12px;
`;

const AccountDropdownWrapper = styled.div`
  margin-bottom: 12px;
`;

const CustomLabel = styled(Typography)`
  font-size: 1em;
`;

interface Props {
  networkId: NetworkId;
  byteCode: string;
  account: StoreAccount;
  rawTransaction: ITxConfig;
  handleNetworkSelected(networkId: string): void;
  handleDeploySubmit(): void;
  handleAccountSelected(account: StoreAccount): void;
  handleGasSelectorChange(payload: any): void;
  handleByteCodeChanged(byteCode: string): void;
}

export default function Deploy(props: Props) {
  const {
    networkId,
    byteCode,
    account,
    rawTransaction,
    handleNetworkSelected,
    handleDeploySubmit,
    handleAccountSelected,
    handleGasSelectorChange,
    handleByteCodeChanged
  } = props;
  const [error, setError] = useState(undefined);
  const [gasCallProps, setGasCallProps] = useState({});
  const { accounts } = useContext(StoreContext);

  const { gasPrice, gasLimit, nonce } = rawTransaction;
  const filteredAccounts = getAccountsInNetwork(accounts, networkId);

  useEffect(() => {
    debouncedUpdateGasCall.current(account, byteCode);
  }, [account]);

  const byteCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value }
    } = e;
    handleByteCodeChanged(value);
    debouncedUpdateGasCall.current(account, value);
  };

  const updateGasCallProps = (acc: StoreAccount, byteCodeVal: string) => {
    if (!acc) {
      return;
    }

    setGasCallProps(constructGasCallProps(byteCodeVal, acc));
  };

  const debouncedUpdateGasCall = useRef(
    debounce((acc: StoreAccount, byteCodeVal: string) => updateGasCallProps(acc, byteCodeVal), 700)
  );

  const deploySubmit = async () => {
    setError(undefined);
    try {
      await handleDeploySubmit();
    } catch (e) {
      setError(e.message);
    }
  };

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
    <div>
      <NetworkSelectorWrapper>
        <NetworkSelectDropdown
          network={networkId}
          onChange={network => {
            handleNetworkSelected(network);
          }}
        />
      </NetworkSelectorWrapper>
      <FieldWrapper>
        <InputWrapper>
          <InputField
            label={translateRaw('CONTRACT_BYTECODE')}
            value={byteCode}
            placeholder="0x8f87a973e..."
            onChange={byteCodeChange}
            textarea={true}
            resizableTextArea={true}
            height={'108px'}
          />
        </InputWrapper>
      </FieldWrapper>

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
            estimateGasCallProps={gasCallProps}
          />
        )}
      </AccountDropdownWrapper>

      {error && (
        <ErrorWrapper>
          <InlineErrorMsg>{error}</InlineErrorMsg>
        </ErrorWrapper>
      )}

      <ButtonWrapper>
        <Button onClick={deploySubmit}>{translateRaw('NAV_DEPLOYCONTRACT')}</Button>
      </ButtonWrapper>
    </div>
  );
}
