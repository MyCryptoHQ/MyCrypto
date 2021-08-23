import React, { useEffect, useState } from 'react';

import crowdedBlock from 'assets/images/illustrations/crowded-block.svg';
import notIncluded from 'assets/images/illustrations/not-included-in-block.svg';
import txInBlock from 'assets/images/illustrations/tx-in-block.svg';
import txPool from 'assets/images/illustrations/tx-pool.svg';

import { Box, Button, Icon, LinkApp, Text } from '@components';
import { Body, Heading } from '@components/NewTypography';
import { TransactionFeeEIP1559 } from '@components/TransactionFeeEIP1559';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';
import { Fiat, ITxReceipt, ITxStatus, ITxType2Receipt, Network } from '@types';
import { bigNumGasPriceToViewableGwei, buildTxUrl, useTimeout } from '@utils';

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
  const { baseAsset, gasLimit, maxFeePerGas, maxPriorityFeePerGas } = txReceipt as ITxType2Receipt;

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
      <Box variant="rowCenter">
        <img src={illustration} />
      </Box>
      {resend && (
        <>
          <TransactionFeeEIP1559
            baseAsset={baseAsset}
            gasLimit={gasLimit.toString()}
            maxFeePerGas={bigNumGasPriceToViewableGwei(maxFeePerGas)}
            maxPriorityFeePerGas={bigNumGasPriceToViewableGwei(maxPriorityFeePerGas)}
            fiat={fiat}
            label={translateRaw('CURRENT_TRANSACTION_FEE')}
            baseAssetRate={baseAssetRate}
            isEstimatingGasLimit={false}
            isEstimatingGasPrice={false}
            disabled={true}
          />
          <Box variant="rowCenter">
            <Icon
              type="arrow-right"
              width="24px"
              height="24px"
              fill={COLORS.BLUE_BRIGHT}
              transform="rotate(90)"
              my="3"
            />
          </Box>
          <TransactionFeeEIP1559
            baseAsset={baseAsset}
            gasLimit={gasLimit.toString()}
            maxFeePerGas={bigNumGasPriceToViewableGwei(maxFeePerGas)}
            maxPriorityFeePerGas={bigNumGasPriceToViewableGwei(maxPriorityFeePerGas)}
            fiat={fiat}
            label={translateRaw('UPDATED_TRANSACTION_FEE')}
            baseAssetRate={baseAssetRate}
            isEstimatingGasLimit={false}
            isEstimatingGasPrice={false}
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
