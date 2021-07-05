import { useEffect, useRef, useState } from 'react';

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
import { AppState, getIsDemoMode, getStoreAccounts, selectNetwork, useSelector } from '@store';
import { translateRaw } from '@translations';
import { NetworkId, StoreAccount } from '@types';
import { getAccountsByNetwork, getAccountsByViewOnly } from '@utils';
import { pipe } from '@vendor';

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

interface DeployProps {
  networkId: NetworkId;
  byteCode: string;
  account: StoreAccount;
  nonce: string;
  gasLimit: string;
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  handleNetworkSelected(networkId: string): void;
  handleDeploySubmit(): void;
  handleAccountSelected(account: StoreAccount): void;
  handleGasSelectorChange(payload: any): void;
  handleByteCodeChanged(byteCode: string): void;
  handleGasLimitChange(payload: string): void;
  handleNonceChange(payload: string): void;
}

export const Deploy = (props: Props) => {
  const {
    networkId,
    byteCode,
    account,
    nonce,
    gasLimit,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    handleNetworkSelected,
    handleDeploySubmit,
    handleAccountSelected,
    handleNonceChange,
    handleGasLimitChange,
    handleGasSelectorChange,
    handleByteCodeChanged,
    isDemoMode
  } = props;
  const [error, setError] = useState(undefined);
  const [gasCallProps, setGasCallProps] = useState({});
  const accounts = useSelector(getStoreAccounts);

  const network = useSelector(selectNetwork(networkId));

  const filteredAccounts = pipe(
    (a: StoreAccount[]) => getAccountsByNetwork(a, networkId),
    (a) => getAccountsByViewOnly(a, false)
  )(accounts);

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
      setError(e.reason ? e.reason : e.message);
    }
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
            name="byteCode"
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
            gasPrice={gasPrice}
            gasLimit={gasLimit}
            nonce={nonce}
            maxFeePerGas={maxFeePerGas}
            maxPriorityFeePerGas={maxPriorityFeePerGas}
            account={account}
            setGasPrice={handleGasSelectorChange}
            setGasLimit={handleGasLimitChange}
            setNonce={handleNonceChange}
            estimateGasCallProps={gasCallProps}
            network={network}
          />
        )}
      </MarginWrapper>

      {error && (
        <MarginWrapper>
          <InlineMessage>{error}</InlineMessage>
        </MarginWrapper>
      )}

      <ButtonWrapper>
        <Button disabled={isDemoMode} onClick={deploySubmit} fullwidth={true}>
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
