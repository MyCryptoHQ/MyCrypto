import { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useStore } from 'react-redux';
import styled from 'styled-components';

import { Body, Box, BusyBottom, Heading } from '@components';
import { InlineMessage } from '@components/InlineMessage';
import { WALLETS_CONFIG } from '@config';
import { getNetworkByChainId, useNetworks } from '@services/Store';
import { BREAK_POINTS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { BusyBottomConfig, InlineMessageType, ISignComponentProps } from '@types';
import { createSignerProvider } from '@utils/signerProvider';

enum WalletSigningState {
  READY, //when signerWallet is ready to sendTransaction
  NOT_READY,
  REJECTED, //use when signerWallet rejects transaction
  UNKNOWN //used upon component initialization when wallet status is not determined
}

const Footer = styled.div`
  width: 100%;
  margin-top: 2em;
`;

const Web3ImgContainer = styled.div`
  margin: 2em;
  display: flex;
  justify-content: center;
  align-content: center;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    padding-bottom: 1em;
  }
`;

const Web3Img = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 150px;
  & img {
    width: 150px;
  }
`;

const SInlineMessage = styled(InlineMessage)`
  text-align: center;
`;

const SignTransactionQuill = ({
  rawTransaction,
  senderAccount,
  onSuccess
}: ISignComponentProps) => {
  const { networks } = useNetworks();
  const store = useStore();
  const detectedNetwork = getNetworkByChainId(rawTransaction.chainId, networks);

  const [submitting, setSubmitting] = useState(false);
  const [walletState, setWalletState] = useState(WalletSigningState.UNKNOWN);
  const [error, setError] = useState('');

  const ws = createSignerProvider(store);

  const ethersProvider = new Web3Provider(ws, detectedNetwork!.chainId);

  const { gasLimit, ...tx } = rawTransaction;

  useEffect(() => {
    if (!submitting) {
      setSubmitting(true);
      ethersProvider
        .getSigner()
        .provider.send('eth_signTransaction', [
          { ...tx, gas: gasLimit, from: senderAccount.address }
        ])
        .then((txHash) => {
          onSuccess(txHash);
        })
        .catch((err) => {
          setSubmitting(false);
          console.debug(`[SignTransactionWeb3] ${err.message}`);
          setError(err.message);
          if (err.message.includes('User denied transaction signature')) {
            setWalletState(WalletSigningState.REJECTED);
          } else {
            setWalletState(WalletSigningState.UNKNOWN);
          }
        });
    }
  }, []);

  return (
    <Box>
      <Heading fontSize="32px" textAlign="center" fontWeight="bold">
        {translate('SIGN_TX_TITLE', {
          $walletName: WALLETS_CONFIG.QUILL.name
        })}
      </Heading>
      <Body textAlign="center" lineHeight="1.5" fontSize={FONT_SIZE.MD} paddingTop={SPACING.LG}>
        {translate('SIGN_TX_WEB3_PROMPT', {
          $walletName: WALLETS_CONFIG.QUILL.name
        })}
      </Body>
      <Web3ImgContainer>
        <Web3Img>
          <img src={WALLETS_CONFIG.QUILL.icon} />
        </Web3Img>
      </Web3ImgContainer>

      <>
        <Box variant="columnCenter" pt={SPACING.SM}>
          {walletState === WalletSigningState.REJECTED && (
            <SInlineMessage>{translate('SIGN_TX_WEB3_REJECTED')}</SInlineMessage>
          )}
          {walletState === WalletSigningState.UNKNOWN && error && (
            <SInlineMessage>{error}</SInlineMessage>
          )}
          {submitting && (
            <SInlineMessage type={InlineMessageType.INDICATOR_INFO_CIRCLE}>
              {translate('SIGN_TX_SUBMITTING_PENDING')}
            </SInlineMessage>
          )}
        </Box>
        <Body textAlign="center" lineHeight="1.5" fontSize={FONT_SIZE.MD} marginTop="16px">
          {translateRaw('SIGN_TX_EXPLANATION')}
        </Body>
        <Footer>
          <BusyBottom type={BusyBottomConfig.QUILL} />
        </Footer>
      </>
    </Box>
  );
};

export default SignTransactionQuill;
