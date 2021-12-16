import { useEffect, useState } from 'react';

import { getAddress } from '@ethersproject/address';
import { Web3Provider } from '@ethersproject/providers';
import styled from 'styled-components';

import { Body, Box, BusyBottom, Heading, InlineMessage } from '@components';
import { TxIntermediaryDisplay } from '@components/TransactionFlow/displays';
import { isContractInteraction } from '@components/TransactionFlow/helpers';
import { IWalletConfig, WALLETS_CONFIG } from '@config';
import { useNetworks } from '@services/Store';
import { getContractName, useSelector } from '@store';
import { BREAK_POINTS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import {
  BusyBottomConfig,
  InlineMessageType,
  ISignComponentProps,
  ITxObject,
  StoreAccount,
  TAddress,
  WalletId
} from '@types';
import { getWeb3Config, isSameAddress } from '@utils';

export enum WalletSigningState {
  SUBMITTING,
  REJECTED,
  ADDRESS_MISMATCH,
  NETWORK_MISMATCH,
  SUCCESS,
  UNKNOWN //used upon component initialization when wallet status is not determined
}

export default function SignTransactionWeb3({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  const [walletState, setWalletState] = useState(WalletSigningState.UNKNOWN);

  const desiredAddress = getAddress(senderAccount.address);

  const { getNetworkByChainId } = useNetworks();
  const detectedNetwork = getNetworkByChainId(rawTransaction.chainId);
  const networkName = detectedNetwork ? detectedNetwork.name : translateRaw('UNKNOWN_NETWORK');
  const walletConfig = getWeb3Config();

  useEffect(() => {
    const ethereumProvider = (window as CustomWindow).ethereum;
    if (ethereumProvider) {
      // enable() is deprecated by MetaMask, but the alternative request() function is not implemented by all web3 wallets yet.
      // @todo: Use request() when possible
      (window as CustomWindow).ethereum.enable().then(() => {
        attemptSign();
        ethereumProvider.on('accountsChanged', () => attemptSign());
        ethereumProvider.on('networkChanged', () => attemptSign());
      });
    } else {
      throw Error('No web3 found');
    }
    return () => {
      ethereumProvider.removeAllListeners();
    };
  }, []);

  const attemptSign = async () => {
    const ethereumProvider = (window as CustomWindow).ethereum;
    const web3Provider = new Web3Provider(ethereumProvider);

    if (!web3Provider) {
      return;
    }

    const web3Signer = web3Provider.getSigner();
    const web3Address = await web3Signer.getAddress();
    const checksumAddress = getAddress(web3Address);

    const web3Network = await web3Provider.getNetwork();
    const addressMatches = isSameAddress(checksumAddress as TAddress, desiredAddress as TAddress);
    if (!addressMatches) {
      setWalletState(WalletSigningState.ADDRESS_MISMATCH);
      return;
    }

    const web3NetworkByChainId = getNetworkByChainId(web3Network.chainId);
    if (!web3NetworkByChainId) {
      // @todo figure out error
      return;
    }

    const networkMatches = web3NetworkByChainId.name === networkName;
    if (!networkMatches) {
      setWalletState(WalletSigningState.NETWORK_MISMATCH);
      return;
    }

    setWalletState(WalletSigningState.SUBMITTING);
    const signerWallet = web3Provider.getSigner();

    // Calling ethers.js with a tx object containing a 'from' property
    // will fail https://github.com/ethers-io/ethers.js/issues/692.
    const { from, ...rawTx } = rawTransaction;
    signerWallet
      .sendUncheckedTransaction(rawTx)
      .then((txHash) => {
        setWalletState(WalletSigningState.SUCCESS);
        onSuccess(txHash);
      })
      .catch((err) => {
        console.debug(`[SignTransactionWeb3] ${err.message}`);
        if (err.message.includes('User denied transaction signature')) {
          setWalletState(WalletSigningState.REJECTED);
        } else {
          setWalletState(WalletSigningState.UNKNOWN);
        }
      });
  };

  const network = senderAccount.networkId;
  const contractName = useSelector(getContractName(network, rawTransaction.to));

  return (
    <SignTransactionWeb3UI
      walletConfig={walletConfig}
      walletState={walletState}
      networkName={networkName}
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      contractName={contractName}
    />
  );
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

export interface UIProps {
  walletConfig: IWalletConfig;
  walletState: WalletSigningState;
  networkName: string;
  senderAccount: StoreAccount;
  rawTransaction: ITxObject;
  contractName?: string;
}

export const SignTransactionWeb3UI = ({
  walletConfig,
  walletState,
  networkName,
  senderAccount,
  rawTransaction,
  contractName
}: UIProps) => (
  <Box>
    <Heading fontSize="32px" textAlign="center" fontWeight="bold">
      {translate('SIGN_TX_TITLE', {
        $walletName: walletConfig.name || WALLETS_CONFIG.WEB3.name
      })}
    </Heading>
    <Body textAlign="center" lineHeight="1.5" fontSize={FONT_SIZE.MD} paddingTop={SPACING.LG}>
      {translate('SIGN_TX_WEB3_PROMPT', {
        $walletName: walletConfig.name || WALLETS_CONFIG.WEB3.name
      })}
    </Body>
    {isContractInteraction(rawTransaction.data) && rawTransaction.to && (
      <Box mt={3}>
        <TxIntermediaryDisplay address={rawTransaction.to} contractName={contractName} />
      </Box>
    )}
    <Web3ImgContainer>
      <Web3Img>
        <img src={walletConfig.icon} />
      </Web3Img>
    </Web3ImgContainer>

    <>
      <Box variant="columnCenter" pt={SPACING.SM}>
        {walletState === WalletSigningState.REJECTED && (
          <SInlineMessage>{translate('SIGN_TX_WEB3_REJECTED')}</SInlineMessage>
        )}
        {walletState === WalletSigningState.NETWORK_MISMATCH && (
          <SInlineMessage>
            {translate('SIGN_TX_WEB3_FAILED_NETWORK', {
              $walletName: walletConfig.name,
              $networkName: networkName
            })}
          </SInlineMessage>
        )}
        {walletState === WalletSigningState.ADDRESS_MISMATCH && (
          <SInlineMessage>
            {translate('SIGN_TX_WEB3_FAILED_ACCOUNT', {
              $walletName: walletConfig.name,
              $address: senderAccount.address
            })}
          </SInlineMessage>
        )}
        {walletState === WalletSigningState.SUBMITTING && (
          <SInlineMessage type={InlineMessageType.INDICATOR_INFO_CIRCLE}>
            {translate('SIGN_TX_SUBMITTING_PENDING')}
          </SInlineMessage>
        )}
      </Box>
      <Body textAlign="center" lineHeight="1.5" fontSize={FONT_SIZE.MD} marginTop="16px">
        {translateRaw('SIGN_TX_EXPLANATION')}
      </Body>
      <Footer>
        <BusyBottom
          type={
            walletConfig.id === WalletId.METAMASK
              ? BusyBottomConfig.METAMASK_SIGN
              : BusyBottomConfig.GENERIC_WEB3
          }
        />
      </Footer>
    </>
  </Box>
);
