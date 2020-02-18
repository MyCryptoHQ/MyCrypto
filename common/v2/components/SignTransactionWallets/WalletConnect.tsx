import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import * as R from 'ramda';

import translate, { translateRaw } from 'v2/translations';
import { Button, CodeBlock, QRCodeContainer, Typography, Overlay, Spinner } from 'v2/components';
import { WalletId, ISignComponentProps, TAddress } from 'v2/types';
import { getWalletConfig } from 'v2/config';
import { COLORS, FONT_SIZE, BREAK_POINTS } from 'v2/theme';
import { useUpdateEffect } from 'v2/vendor';
import { noOp, truncate, objToString } from 'v2/utils';
import { getNetworkByChainId } from 'v2/services';
import { StoreContext } from 'v2/services/Store';
import { useWalletConnect, WcReducer, TActionError, ITxData } from 'v2/services/WalletService';

import EthAddress from '../EthAddress';

const SHeader = styled.div`
  font-size: ${FONT_SIZE.XXL};
  font-weight: bold;
  color: var(--dark-slate-blue);
  text-align: center;
  margin-bottom: 1em;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    font-size: ${FONT_SIZE.XL};
  }
`;
const SContent = styled.div``;

const SSection = styled.div<{ center: boolean; withOverlay?: boolean }>`
  ${props =>
    props.center &&
    css`
      margin: 0 auto;
      text-align: center;
    `}

  ${props =>
    props.withOverlay &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 415px;
      width: 415px;
      position: relative;
    `}

  padding: 1em 0;
  font-size: ${FONT_SIZE.MD};
  text-overflow: ellipsis;
`;

const SFooter = styled.div`
  display: flex;
  justify-content: center;
  margin: 1em 0;
`;

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  &&& span,
  button {
    color: ${COLORS.WHITE};
  }
`;

const helpLink = getWalletConfig(WalletId.WALLETCONNECT).helpLink;

interface ErrorProps {
  address: TAddress;
  network: string;
  onClick(): void;
}

const ErrorHandlers: { [K in TActionError]: React.SFC<ErrorProps> } = {
  WRONG_ADDRESS: ({ address }) => (
    <Typography style={{ padding: '0 2em' }}>
      {translateRaw('SIGN_TX_WALLETCONNECT_FAILED_ACCOUNT', {
        $walletName: translateRaw('X_WALLETCONNECT'),
        $address: address
      })}
    </Typography>
  ),
  WRONG_NETWORK: ({ network }) => (
    <Typography style={{ padding: '0 2em' }}>
      {translateRaw('SIGN_TX_WALLETCONNECT_FAILED_NETWORK', {
        $walletName: translateRaw('X_WALLETCONNECT'),
        $network: network
      })}
    </Typography>
  ),
  CONNECTION_REJECTED: ({ onClick }) => (
    <>
      <Typography>Session Rejected</Typography>
      <div style={{ marginTop: '1em' }}>
        <Button onClick={onClick}>Try Again</Button>
      </div>
    </>
  ),
  SIGN_REJECTED: ({ onClick }) => (
    <>
      <Typography>Transaction Rejected</Typography>
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
  const { networks } = useContext(StoreContext);

  const sendTx = () =>
    requestSign({
      from: senderAccount.address,
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
      address: senderAccount.address,
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
    <>
      <SHeader>
        {translate('SIGNER_SELECT_WALLETCONNECT', { $walletId: translateRaw('X_WALLETCONNECT') })}
      </SHeader>
      <SContent>
        {state.isConnected ? (
          <>
            <SSection center={true}>
              <Typography>
                Session connected with{' '}
                <EthAddress
                  inline={true}
                  isCopyable={false}
                  address={state.detectedAddress!}
                  truncate={truncate}
                />{' '}
                on network {getNetworkByChainId(state.detectedChainId!, networks)!.name}
              </Typography>
            </SSection>
            <SSection center={true} style={{ maxWidth: '430px' }}>
              <Typography>Requesting signature for transcation:</Typography>
              <CodeBlock>{objToString(rawTransaction)}</CodeBlock>
            </SSection>
          </>
        ) : (
          <SSection center={true}>
            <Typography as="div">
              1. Open the wallet containing the account {senderAccount.address}
            </Typography>
            <Typography as="div">2. Select the {senderAccount.networkId} network</Typography>
            <Typography as="div">3. Scan the QRCode below</Typography>
          </SSection>
        )}
        <SSection center={true} withOverlay={true}>
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
                  <Typography>Pending Confirmation</Typography>
                  <div style={{ margin: '1em 0' }}>
                    <Spinner />
                  </div>
                  <Typography>Please confirm the transaction on your wallet</Typography>
                </>
              )}
            </SContainer>
          </Overlay>
          <QRCodeContainer data={state.uri} disableSpinner={true} />
        </SSection>
      </SContent>
      <SFooter>
        <Typography>{translate('ADD_WALLETCONNECT_LINK', { $wiki_link: helpLink })}</Typography>
      </SFooter>
    </>
  );
}

export default SignTransactionWalletConnect;
