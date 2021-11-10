import React, { FC, useCallback, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useStore } from 'react-redux';
import styled from 'styled-components';

import { Body, Box, BusyBottom, Button, Heading, InlineMessage } from '@components';
import { WALLETS_CONFIG } from '@config';
import { useNetworks } from '@services/Store';
import { BREAK_POINTS } from '@theme';
import translate from '@translations';
import { BusyBottomConfig, FormData } from '@types';
import { createSignerProvider } from '@utils/signerProvider';

interface Props {
  formData: FormData;
  onUnlock(param: string[]): void;
}

interface IWeb3UnlockError {
  error: boolean;
  message: string;
}

const Web3ImgContainer = styled.div`
  padding-bottom: 3em;
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

const Footer = styled.div`
  text-align: center;
`;

const QuillDecrypt: FC<Props> = ({ formData, onUnlock }) => {
  const { addNodeToNetwork, networks } = useNetworks();
  const network = networks.find((n) => n.id === formData.network);

  const store = useStore();
  const ws = createSignerProvider(store);

  const ethersProvider = new Web3Provider(ws, network!.chainId);

  const [web3Unlocked, setWeb3Unlocked] = useState<boolean | undefined>(undefined);
  const [web3UnlockError, setWeb3UnlockError] = useState<IWeb3UnlockError | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const unlockWallet = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const walletPayload: string[] | undefined = await ethersProvider.listAccounts();

      if (!walletPayload) {
        throw new Error('Failed to unlock web3 wallet');
      }

      onUnlock(walletPayload);
    } catch (e) {
      setWeb3UnlockError({ error: true, message: e.message });
      setWeb3Unlocked(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [addNodeToNetwork, setWeb3Unlocked]);

  return (
    <Box p="2.5em">
      <Heading fontSize="32px" textAlign="center" fontWeight="bold">
        {translate('ADD_ACCOUNT_WEB3_TITLE', { $walletId: WALLETS_CONFIG.QUILL.name })}
      </Heading>
      <Body textAlign="center" fontSize="2" paddingTop="16px">
        {translate(`ADD_ACCOUNT_WEB3_DESC`)}
      </Body>
      <Box m="2em" variant="columnCenter">
        <Web3ImgContainer>
          <Web3Img>
            <img src={WALLETS_CONFIG.QUILL.icon} />
          </Web3Img>
        </Web3ImgContainer>
        <Button disabled={isSubmitting} onClick={unlockWallet}>
          {isSubmitting && translate('WALLET_UNLOCKING')}
          {!isSubmitting && translate('ADD_WEB3', { $walletId: WALLETS_CONFIG.QUILL.name })}
        </Button>

        {web3Unlocked === false && (
          <>
            {web3UnlockError && web3UnlockError.error && web3UnlockError.message.length > 0 ? (
              <InlineMessage>{web3UnlockError.message}</InlineMessage>
            ) : (
              <InlineMessage>
                {translate('WEB3_ONUNLOCK_NOT_FOUND_ERROR', {
                  $walletId: WALLETS_CONFIG.QUILL.name
                })}
              </InlineMessage>
            )}
          </>
        )}
      </Box>
      <Footer>
        <BusyBottom type={BusyBottomConfig.QUILL} />
      </Footer>
    </Box>
  );
};

export default QuillDecrypt;
