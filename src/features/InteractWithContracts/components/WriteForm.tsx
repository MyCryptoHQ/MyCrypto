import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import { AccountSelector, Button, DemoGatewayBanner, GasSelector, Typography } from '@components';
import { AppState, getIsDemoMode, getStoreAccounts, useSelector } from '@store';
import { translateRaw } from '@translations';
import { Network, StoreAccount } from '@types';
import { getAccountsByNetwork, getAccountsByViewOnly } from '@utils';
import { pipe } from '@vendor';

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
`;

const CustomLabel = styled(Typography)`
  font-size: 1em;
`;

interface WriteProps {
  account: StoreAccount;
  network: Network;
  currentFunction: ABIItem;
  gasLimit: string;
  nonce: string;
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  estimateGasCallProps: TObject;
  handleAccountSelected(account: StoreAccount): void;
  handleSubmit(submitedFunction: ABIItem): void;
  handleGasSelectorChange(payload: any): void;
  handleGasLimitChange(payload: string): void;
  handleNonceChange(payload: string): void;
}

export const WriteForm = (props: Props) => {
  const {
    account,
    network,
    currentFunction,
    gasLimit,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    estimateGasCallProps,
    handleAccountSelected,
    handleSubmit,
    handleGasSelectorChange,
    handleGasLimitChange,
    handleNonceChange,
    isDemoMode
  } = props;

  const accounts = useSelector(getStoreAccounts);
  const filteredAccounts = pipe(
    (a: StoreAccount[]) => getAccountsByNetwork(a, network.id),
    (a) => getAccountsByViewOnly(a, false)
  )(accounts);

  return (
    <WriteActionWrapper>
      {isDemoMode && <DemoGatewayBanner />}
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
            gasPrice={gasPrice}
            maxFeePerGas={maxFeePerGas}
            maxPriorityFeePerGas={maxPriorityFeePerGas}
            gasLimit={gasLimit}
            nonce={nonce}
            account={account}
            setGasPrice={handleGasSelectorChange}
            setGasLimit={handleGasLimitChange}
            setNonce={handleNonceChange}
            estimateGasCallProps={estimateGasCallProps}
            network={network}
          />
        )}
      </AccountSelectorWrapper>

      <ActionButton
        disabled={isDemoMode}
        onClick={() => handleSubmit(currentFunction)}
        fullwidth={true}
      >
        {translateRaw('ACTION_17')}
      </ActionButton>
    </WriteActionWrapper>
  );
};

const mapStateToProps = (state: AppState) => ({
  isDemoMode: getIsDemoMode(state)
});

const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector> & WriteProps;

export default connector(WriteForm);
