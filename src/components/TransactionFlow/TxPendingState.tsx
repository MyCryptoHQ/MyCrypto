import React, { useEffect, useState } from 'react';

import crowdedBlock from 'assets/images/illustrations/crowded-block.svg';
import notIncluded from 'assets/images/illustrations/not-included-in-block.svg';
import txInBlock from 'assets/images/illustrations/tx-in-block.svg';
import txPool from 'assets/images/illustrations/tx-pool.svg';

import { Box, Button, Icon, LinkApp, Text } from '@components';
import { Body, Heading } from '@components/NewTypography';
import { TransactionFeeEIP1559 } from '@components/TransactionFeeEIP1559';
import { useGasForm } from '@hooks';
import { translateRaw } from '@translations';
import { Fiat, ITxReceipt, ITxStatus, ITxType2Receipt, Network } from '@types';
import { bigNumGasPriceToViewableGwei, buildTxUrl, noOp, useTimeout } from '@utils';

interface Props {
  network: Network;
  txReceipt: ITxReceipt;
  fiat: Fiat;
  baseAssetRate: number;
  showDetails(): void;
}

const CROWDED_TIMEOUT = 20 * 1000; // 20 sec in ms

enum PendingState {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  CROWDED = 'CROWDED',
  NOT_INCLUDED = 'NOT_INCLUDED'
}

const states = {
  PENDING: {
    header: 'Transaction Processing...',
    description: 'bla',
    illustration: txPool,
    resend: false
  },
  SUCCESS: {
    header: 'Your transaction made it into the block!',
    description: 'bla',
    illustration: txInBlock,
    resend: false
  },
  CROWDED: {
    header: 'The network is currently crowded',
    description: 'bla',
    illustration: crowdedBlock,
    resend: true
  },
  NOT_INCLUDED: {
    header: 'Your transaction was not included in the current block',
    description: 'bla',
    illustration: notIncluded,
    resend: true
  }
};

export const TxPendingState = ({ network, txReceipt, fiat, baseAssetRate, showDetails }: Props) => {
  const [state, setState] = useState<PendingState>(PendingState.PENDING);
  const { header, description, illustration, resend } = states[state];
  const {
    baseAsset,
    gasLimit: curGasLimit,
    maxFeePerGas: curMaxFeePerGas,
    maxPriorityFeePerGas: curMaxPriorityFeePerGas
  } = txReceipt as ITxType2Receipt;

  const initialValues = {
    gasLimitField: curGasLimit,
    maxFeePerGasField: curMaxFeePerGas,
    maxPriorityFeePerGasField: curMaxPriorityFeePerGas
  };

  const {
    values,
    handleGasLimitChange,
    handleMaxFeeChange,
    handleMaxPriorityFeeChange
  } = useGasForm({
    initialValues,
    onSubmit: noOp
  });

  const {
    gasLimitField: newGasLimit,
    maxFeePerGasField: newMaxFeePerGas,
    maxPriorityFeePerGasField: newMaxPriorityFeePerGas
  } = values;

  useEffect(() => {
    if (txReceipt.status === ITxStatus.SUCCESS) {
      setState(PendingState.SUCCESS);
    }
  }, [txReceipt.status]);

  useTimeout(() => {
    if (txReceipt.status === ITxStatus.PENDING) {
      setState(PendingState.CROWDED);
    }
  }, CROWDED_TIMEOUT);

  return (
    <Box>
      <Heading fontWeight="bold" fontSize="3">
        {header}
      </Heading>
      <Body mt="1">{description}</Body>
      <Box variant="rowCenter">
        <img src={illustration} />
      </Box>
      <Box bg="BG_GRAY" variant="rowAlign" my="3" p="2">
        <Body as="span" fontWeight="bold" width="20%">
          {translateRaw('TX_HASH')}
          {': '}
        </Body>
        <Box display="inline-flex" variant="rowAlign">
          <Text as="span" overflow="hidden">
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
          <TransactionFeeEIP1559
            baseAsset={baseAsset}
            gasLimit={curGasLimit.toString()}
            maxFeePerGas={bigNumGasPriceToViewableGwei(curMaxFeePerGas)}
            maxPriorityFeePerGas={bigNumGasPriceToViewableGwei(curMaxPriorityFeePerGas)}
            fiat={fiat}
            label={translateRaw('CURRENT_TRANSACTION_FEE')}
            baseAssetRate={baseAssetRate}
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
            maxFeePerGas={bigNumGasPriceToViewableGwei(newMaxFeePerGas)}
            maxPriorityFeePerGas={bigNumGasPriceToViewableGwei(newMaxPriorityFeePerGas)}
            fiat={fiat}
            label={translateRaw('UPDATED_TRANSACTION_FEE')}
            baseAssetRate={baseAssetRate}
            isEstimatingGasLimit={false}
            isEstimatingGasPrice={false}
            handleGasLimitEstimation={noOp}
            handleGasPriceEstimation={noOp}
            setGasLimit={handleGasLimitChange}
            setMaxFeePerGas={handleMaxFeeChange}
            setMaxPriorityFeePerGas={handleMaxPriorityFeeChange}
          />
          <Button fullwidth={true} onClick={showDetails}>
            {translateRaw('RESEND_TRANSACTION')}
          </Button>
        </>
      )}
      <Button colorScheme="inverted" fullwidth={true} onClick={showDetails}>
        {translateRaw('VIEW_TRANSACTION_DETAILS')}
      </Button>
    </Box>
  );
};
