import React, { useEffect, useState } from 'react';

import crowdedBlock from 'assets/images/illustrations/crowded-block.svg';
import notIncluded from 'assets/images/illustrations/not-included-in-block.svg';
import txInBlock from 'assets/images/illustrations/tx-in-block.svg';
import txPool from 'assets/images/illustrations/tx-pool.svg';

import { Box, Button, Icon, LinkApp, Text } from '@components';
import { Body } from '@components/NewTypography';
import { TransactionFeeEIP1559 } from '@components/TransactionFeeEIP1559';
import { ROUTE_PATHS } from '@config';
import { useGasForm } from '@hooks';
import translate, { translateRaw } from '@translations';
import { Fiat, ITxConfig, ITxReceipt, ITxStatus, ITxType2Receipt, Network, WalletId } from '@types';
import {
  bigify,
  bigNumGasPriceToViewableGwei,
  buildTxUrl,
  constructSpeedUpTxQuery,
  formatSupportEmail,
  inputGasLimitToHex,
  inputGasPriceToHex,
  isWeb3Wallet,
  noOp,
  useMinimumWait,
  useTimeout
} from '@utils';

interface Props {
  network: Network;
  txConfig: ITxConfig;
  txReceipt: ITxReceipt;
  fiat: Fiat;
  baseAssetRate: number;
  showDetails(): void;
  setLabel?(label: string): void;
}

const PENDING_MIN_WAIT = 4 * 1000; // 4 sec in ms
const CROWDED_TIMEOUT = 20 * 1000; // 20 sec in ms

enum PendingState {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  CROWDED = 'CROWDED',
  NOT_INCLUDED = 'NOT_INCLUDED'
}

const states = {
  PENDING: {
    header: translateRaw('TRANSACTION_PENDING_HEADER'),
    description: translateRaw('TRANSACTION_PENDING_DESCRIPTION'),
    illustration: txPool,
    resend: false
  },
  SUCCESS: {
    header: translateRaw('TRANSACTION_SUCCESS_HEADER'),
    description: translateRaw('TRANSACTION_SUCCESS_DESCRIPTION'),
    illustration: txInBlock,
    resend: false
  },
  CROWDED: {
    header: translateRaw('TRANSACTION_CROWDED_HEADER'),
    description: translateRaw('TRANSACTION_CROWDED_DESCRIPTION'),
    illustration: crowdedBlock,
    resend: true
  },
  NOT_INCLUDED: {
    header: '',
    description: '',
    illustration: notIncluded,
    resend: true
  }
};

export const TxPendingState = ({
  network,
  txConfig,
  txReceipt,
  fiat,
  baseAssetRate,
  showDetails,
  setLabel
}: Props) => {
  const [state, setState] = useState<PendingState>(PendingState.PENDING);
  const { header, description, illustration, resend } = states[state];
  const {
    baseAsset,
    gasLimit: curGasLimit,
    maxFeePerGas: curMaxFeePerGas,
    maxPriorityFeePerGas: curMaxPriorityFeePerGas
  } = txReceipt as ITxType2Receipt;

  const account = txConfig.senderAccount;

  const initialValues = {};

  const {
    values,
    baseFee,
    isEstimatingGasPrice,
    isEstimatingGasLimit,
    handleGasLimitChange,
    handleMaxFeeChange,
    handleMaxPriorityFeeChange,
    handleGasPriceEstimation: performGasPriceEstimation,
    handleGasLimitEstimation: performGasLimitEstimation
  } = useGasForm({
    initialValues,
    onSubmit: noOp
  });

  const oldTx = txConfig.rawTransaction;

  const tx = {
    ...oldTx,
    gasLimit: inputGasLimitToHex(values.gasLimitField),
    maxFeePerGas: inputGasPriceToHex(values.maxFeePerGasField),
    maxPriorityFeePerGas: inputGasPriceToHex(values.maxPriorityFeePerGasField)
  };

  const queryString = constructSpeedUpTxQuery(txConfig, {
    maxFeePerGas: values.maxFeePerGasField,
    maxPriorityFeePerGas: values.maxPriorityFeePerGasField
  });

  const handleGasPriceEstimation = () => performGasPriceEstimation(network, account);
  const handleGasLimitEstimation = () => performGasLimitEstimation(network, tx);

  const {
    gasLimitField: newGasLimit,
    maxFeePerGasField: newMaxFeePerGas,
    maxPriorityFeePerGasField: newMaxPriorityFeePerGas
  } = values;

  useMinimumWait(
    () => {
      if (txReceipt.status === ITxStatus.SUCCESS) {
        setState(PendingState.SUCCESS);
      }
    },
    PENDING_MIN_WAIT,
    [txReceipt.status]
  );

  useTimeout(() => {
    if (txReceipt.status === ITxStatus.PENDING) {
      setState(PendingState.CROWDED);
      handleGasPriceEstimation();
    }
  }, CROWDED_TIMEOUT);

  useEffect(() => {
    if (setLabel) {
      setLabel(header);
    }
  }, [header]);

  const isWeb3 = isWeb3Wallet(account.wallet);
  const isMetaMask = account.wallet === WalletId.METAMASK;

  return (
    <Box>
      <Body mt="1">{description}</Body>
      <Box variant="rowCenter">
        <img src={illustration} />
      </Box>
      {resend && (
        <>
          <TransactionFeeEIP1559
            baseAsset={baseAsset}
            gasLimit={bigify(curGasLimit).toString(10)}
            maxFeePerGas={bigNumGasPriceToViewableGwei(curMaxFeePerGas)}
            maxPriorityFeePerGas={bigNumGasPriceToViewableGwei(curMaxPriorityFeePerGas)}
            fiat={fiat}
            label={translateRaw('CURRENT_TRANSACTION_FEE')}
            baseAssetRate={baseAssetRate}
            baseFee={baseFee}
            isEstimatingGasLimit={false}
            isEstimatingGasPrice={false}
            handleGasLimitEstimation={noOp}
            handleGasPriceEstimation={noOp}
            setGasLimit={noOp}
            setMaxFeePerGas={noOp}
            setMaxPriorityFeePerGas={noOp}
            disabled={true}
          />
          <Box variant="rowCenter" p="3">
            <Box bg="rgba(85, 182, 226, 0.2)" p="2" borderRadius="2px">
              <Icon
                type="arrow-right"
                width="24px"
                height="24px"
                style={{ transform: 'rotate(90deg)' }}
              />
            </Box>
          </Box>
          <TransactionFeeEIP1559
            baseAsset={baseAsset}
            gasLimit={newGasLimit.toString()}
            maxFeePerGas={newMaxFeePerGas}
            maxPriorityFeePerGas={newMaxPriorityFeePerGas}
            fiat={fiat}
            label={translateRaw('UPDATED_TRANSACTION_FEE')}
            baseAssetRate={baseAssetRate}
            baseFee={baseFee}
            isEstimatingGasLimit={isEstimatingGasLimit}
            isEstimatingGasPrice={isEstimatingGasPrice}
            handleGasLimitEstimation={handleGasLimitEstimation}
            handleGasPriceEstimation={handleGasPriceEstimation}
            setGasLimit={handleGasLimitChange}
            setMaxFeePerGas={handleMaxFeeChange}
            setMaxPriorityFeePerGas={handleMaxPriorityFeeChange}
          />
        </>
      )}
      {resend && isWeb3 && (
        <Body mt="2">
          {!isMetaMask
            ? translate('PENDING_WEB3_NOTICE', {
                $link: formatSupportEmail(
                  'Please help me speed up my pending stuck transaction using a Web3 provider that is not MetaMask'
                )
              })
            : translateRaw('PENDING_METAMASK_NOTICE')}
        </Body>
      )}
      <Box bg="BG_GRAY" variant="rowAlign" my="3" p="2">
        <Body as="span" fontWeight="bold" width="20%">
          {translateRaw('TX_HASH')}
          {': '}
        </Body>
        <Box display="inline-flex" variant="rowAlign">
          <Text as="span" overflow="hidden" textOverflow="ellipsis">
            {txReceipt.hash}
          </Text>
          {network && network.blockExplorer && (
            <LinkApp
              href={buildTxUrl(network.blockExplorer, txReceipt.hash)}
              isExternal={true}
              variant="opacityLink"
              display="inline-flex"
            >
              <Icon type="link-out" ml={'1ch'} height="1em" />
            </LinkApp>
          )}
        </Box>
      </Box>
      {resend && (
        <>
          {!isWeb3 ? (
            <LinkApp href={`${ROUTE_PATHS.SEND.path}/?${queryString}`} isExternal={false}>
              <Button fullwidth={true}>{translateRaw('RESEND_TRANSACTION')}</Button>
            </LinkApp>
          ) : (
            <LinkApp href={ROUTE_PATHS.DASHBOARD.path} isExternal={false}>
              <Button fullwidth={true}>
                {translateRaw('TRANSACTION_BROADCASTED_BACK_TO_DASHBOARD')}
              </Button>
            </LinkApp>
          )}
        </>
      )}
      <Button colorScheme="inverted" fullwidth={true} onClick={showDetails}>
        {translateRaw('VIEW_TRANSACTION_DETAILS')}
      </Button>
    </Box>
  );
};
