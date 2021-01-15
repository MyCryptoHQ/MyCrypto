import React, { useContext, useEffect, useRef, useState } from 'react';

import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';
import debounce from 'lodash/debounce';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import {
  AccountSelector,
  Button,
  DemoGatewayBanner,
  GasSelector,
  InlineMessage,
  InputField,
  NetworkSelector,
  Typography
} from '@components';
import { StoreContext } from '@services';
import { AppState, getIsDemoMode } from '@store';
import { translateRaw } from '@translations';
import { ITxConfig, NetworkId, StoreAccount } from '@types';
import {
  baseToConvertedUnit,
  getAccountsInNetwork,
  hexToString,
  hexWeiToString,
  inputGasPriceToHex
} from '@utils';

import { constructGasCallProps } from '../helpers';

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

interface DeployProps {
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

export const Deploy = (props: Props) => {
  const {
    networkId,
    byteCode,
    account,
    rawTransaction,
    handleNetworkSelected,
    handleDeploySubmit,
    handleAccountSelected,
    handleGasSelectorChange,
    handleByteCodeChanged,
    isDemoMode
  } = props;
  const [error, setError] = useState(undefined);
  const [gasCallProps, setGasCallProps] = useState({});
  const { accounts } = useContext(StoreContext);

  const { gasPrice, gasLimit, nonce } = rawTransaction;
  const filteredAccounts = getAccountsInNetwork({ accounts, networkId });

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
      {isDemoMode && <DemoGatewayBanner />}
      <NetworkSelectorWrapper>
        <NetworkSelector
          network={networkId}
          onChange={(network) => {
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
        <Button disabled={isDemoMode} onClick={deploySubmit}>
          {translateRaw('NAV_DEPLOYCONTRACT')}
        </Button>
      </ButtonWrapper>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  isDemoMode: getIsDemoMode(state)
});

const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector> & DeployProps;

export default connector(Deploy);
