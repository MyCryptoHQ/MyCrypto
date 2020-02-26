import React, { useState, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';
import { debounce } from 'lodash';

import {
  NetworkSelectDropdown,
  InputField,
  Button,
  InlineMessage,
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
import { COLORS } from 'v2/theme';

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

const MarginWrapper = styled.div`
  margin-bottom: 12px;
`;

const CustomLabel = styled(Typography)`
  font-size: 1em;
`;

const formatGasPrice = (gasPrice: string) =>
  gasPrice.length ? baseToConvertedUnit(hexToString(gasPrice), 9) : gasPrice;

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
    if (!account) return;
    debouncedUpdateGasCall.current(account, byteCode);
  }, [account, byteCode]);

  const debouncedUpdateGasCall = useRef(
    debounce(
      (acc: StoreAccount, byteCodeVal: string) =>
        setGasCallProps(constructGasCallProps(byteCodeVal, acc)),
      700
    )
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
            onChange={({ target: { value } }) => handleByteCodeChanged(value)}
            textarea={true}
            resizableTextArea={true}
            height={'108px'}
          />
        </InputWrapper>
      </FieldWrapper>

      <CustomLabel>{translateRaw('ACCOUNT')}</CustomLabel>
      <MarginWrapper>
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
            gasPrice={formatGasPrice(gasPrice)}
            gasLimit={gasLimit}
            nonce={nonce}
            account={account}
            setGasPrice={handleGasPriceChange}
            setGasLimit={handleGasLimitChange}
            setNonce={handleNonceChange}
            estimateGasCallProps={gasCallProps}
          />
        )}
      </MarginWrapper>

      {error && (
        <MarginWrapper>
          <InlineMessage>{error}</InlineMessage>
        </MarginWrapper>
      )}

      <ButtonWrapper>
        <Button color={COLORS.WHITE} onClick={deploySubmit}>
          {translateRaw('NAV_DEPLOYCONTRACT')}
        </Button>
      </ButtonWrapper>
    </div>
  );
}
