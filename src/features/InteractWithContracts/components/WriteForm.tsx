import React, { useContext } from 'react';

import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import { AccountSelector, Button, DemoGatewayBanner, GasSelector, Typography } from '@components';
import { StoreContext } from '@services';
import { AppState, getIsDemoMode } from '@store';
import { translateRaw } from '@translations';
import { ITxConfig, Network, StoreAccount } from '@types';
import {
  baseToConvertedUnit,
  getAccountsByNetwork,
  getAccountsByViewOnly,
  hexToString,
  hexWeiToString,
  inputGasPriceToHex
} from '@utils';
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
  rawTransaction: ITxConfig;
  estimateGasCallProps: TObject;
  handleAccountSelected(account: StoreAccount): void;
  handleSubmit(submitedFunction: ABIItem): void;
  handleGasSelectorChange(payload: any): void;
}

export const WriteForm = (props: Props) => {
  const {
    account,
    network,
    currentFunction,
    rawTransaction,
    estimateGasCallProps,
    handleAccountSelected,
    handleSubmit,
    handleGasSelectorChange,
    isDemoMode
  } = props;

  const { gasPrice, gasLimit, nonce } = rawTransaction;

  const { accounts } = useContext(StoreContext);
  const filteredAccounts = pipe(
    (a: StoreAccount[]) => getAccountsByNetwork(a, network.id),
    (a) => getAccountsByViewOnly(a, false)
  )(accounts);

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
    handleGasSelectorChange({ gasLimit: val });
  };

  const handleNonceChange = (val: string) => {
    handleGasSelectorChange({ nonce: val });
  };

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
