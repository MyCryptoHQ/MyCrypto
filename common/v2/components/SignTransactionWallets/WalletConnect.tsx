import React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';

import translate, { translateRaw } from 'v2/translations';
import { Button, CodeBlock, QRCodeContainer, Typography, Overlay, Spinner } from 'v2/components';
import { WalletId, ISignComponentProps, TAddress } from 'v2/types';
import { WALLETS_CONFIG } from 'v2/config';
import { COLORS } from 'v2/theme';
import { useUpdateEffect } from 'v2/vendor';
import { noOp } from 'v2/utils';
import { useWalletConnect, WcReducer, TActionError, ITxData } from 'v2/services/WalletService';

import './WalletConnect.scss';

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${COLORS.WHITE};
`;

const toString = (obj = {}) => JSON.stringify(obj, null, 2);
const helpLink = WALLETS_CONFIG[WalletId.WALLETCONNECT].helpLink!;

interface ErrorProps {
  address: TAddress;
  network: string;
  onClick(): void;
}

const ErrorHandlers: { [K in TActionError]: React.SFC<ErrorProps> } = {
  WRONG_ADDRESS: ({ address }) => (
    <Typography style={{ color: 'white', textAlign: 'center', padding: '0 2em' }}>
      {translateRaw('SIGN_TX_WALLETCONNECT_FAILED_ACCOUNT', {
        $walletName: translateRaw('X_WALLETCONNECT'),
        $address: address
      })}
    </Typography>
  ),
  WRONG_NETWORK: ({ network }) => (
    <Typography style={{ color: 'white', textAlign: 'center', padding: '0 2em' }}>
      {translateRaw('SIGN_TX_WALLETCONNECT_FAILED_NETWORK', {
        $walletName: translateRaw('X_WALLETCONNECT'),
        $network: network
      })}
    </Typography>
  ),
  CONNECTION_REJECTED: ({ onClick }) => (
    <>
      <Typography style={{ color: 'white', textAlign: 'center' }}>Session Rejected</Typography>
      <div style={{ marginTop: '1em' }}>
        <Button onClick={onClick}>Try Again</Button>
      </div>
    </>
  ),
  SIGN_REJECTED: ({ onClick }) => (
    <>
      <Typography style={{ color: 'white', textAlign: 'center' }}>Transaction Rejected</Typography>
      <div style={{ marginTop: '1em' }}>
        <Button onClick={onClick}>Try Again</Button>
      </div>
    </>
  )
};

export function SignTransactionWalletConnect({
  senderAccount,
  rawTransaction,
  network,
  onSuccess
}: ISignComponentProps) {
  const { state, requestConnection, requestSign } = useWalletConnect();

  const sendTx = () =>
    requestSign({
      from: senderAccount.address as TAddress,
      ...rawTransaction
    })
      .then((txHash: ITxData) => onSuccess(txHash))
      .catch(console.debug);

  const getErrorMessage = (code: TActionError) => {
    const getAction = () => {
      switch (code) {
        case WcReducer.errorCodes.SIGN_REJECTED:
          return sendTx;
        case WcReducer.errorCodes.CONNECTION_REJECTED:
          return requestConnection;
        default:
          return noOp;
      }
    };
    return ErrorHandlers[code]({
      address: senderAccount.address as TAddress,
      network: network.name,
      onClick: getAction()
    });
  };

  // Once we have a valid session we ask the user to sign the tx.
  // 1. Make sure a session exists
  // 2. When 'promptSignRetry' is true, we are waiting for a user confirmation,
  //    so we bail in the meantime.
  useUpdateEffect(() => {
    if (!state.isConnected || state.promptSignRetry || !R.isEmpty(state.errors)) return;
    sendTx();
  }, [state.isConnected, state.promptSignRetry, state.errors]);

  return (
    <div>
      <div className="wc-title">
        {translate('SIGNER_SELECT_WALLETCONNECT', { $walletId: translateRaw('X_WALLETCONNECT') })}
      </div>
      <section className="wc-container">
        <div className="wc-content">
          {state.isConnected ? (
            <>
              <div>
                <Typography>Session Connected to:</Typography>
                <CodeBlock>
                  {toString({
                    address: state.detectedAddress,
                    chainId: state.detectedChainId
                  })}
                </CodeBlock>
              </div>
              <div className="wc-content">
                <Typography>Requesting signature for transcation:</Typography>
                <CodeBlock>{toString(rawTransaction)}</CodeBlock>
              </div>
            </>
          ) : (
            <>
              <div style={{ padding: '0 15px' }}>
                <Typography as="div">
                  1. Open the wallet containing the account {senderAccount.address}
                </Typography>
                <Typography as="div">2. Select the {senderAccount.networkId} network</Typography>
                <Typography as="div">3. Scan the QRCode below</Typography>
              </div>
            </>
          )}
        </div>
      </section>
      <section className="wc-container">
        <div className="wc-qr-container">
          <Overlay
            absolute={true}
            center={true}
            show={state.isConnected || !R.isEmpty(state.errors)}
          >
            <SContainer>
              {!R.isEmpty(state.errors) ? (
                getErrorMessage(state.errors![0])
              ) : (
                <>
                  <Typography style={{ color: 'white' }}>Pending Confirmation</Typography>
                  <div style={{ marginTop: '1em' }}>
                    <Spinner />
                  </div>
                  <Typography style={{ color: 'white' }}>
                    Confirm the transaction on your wallet
                  </Typography>
                </>
              )}
            </SContainer>
          </Overlay>
          <QRCodeContainer data={state.uri} disableSpinner={true} />
        </div>
        <div style={{ margin: '1em auto', textAlign: 'center' }}>
          {translate('ADD_WALLETCONNECT_LINK', { $wiki_link: helpLink })}
        </div>
      </section>
    </div>
  );
}

export default SignTransactionWalletConnect;
