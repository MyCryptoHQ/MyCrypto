import React, { useEffect, useState } from 'react';

import crowdedBlock from 'assets/images/illustrations/crowded-block.svg';
import notIncluded from 'assets/images/illustrations/not-included-in-block.svg';
import txInBlock from 'assets/images/illustrations/tx-in-block.svg';
import txPool from 'assets/images/illustrations/tx-pool.svg';

import { Box, Button, Icon, LinkApp, Text } from '@components';
import { Body, Heading } from '@components/NewTypography';
import { translateRaw } from '@translations';
import { ITxReceipt, ITxStatus, Network } from '@types';
import { buildTxUrl, useTimeout } from '@utils';

interface Props {
  network: Network;
  txReceipt: ITxReceipt;
  viewDetails(): void;
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
    illustration: txPool
  },
  SUCCESS: {
    header: 'Your transaction made it into the block!',
    description: 'bla',
    illustration: txInBlock
  },
  CROWDED: {
    header: 'The network is currently crowded',
    description: 'bla',
    illustration: crowdedBlock
  },
  NOT_INCLUDED: {
    header: 'Your transaction was not included in the current block',
    description: 'bla',
    illustration: notIncluded
  }
};

export const TxPendingState = ({ network, txReceipt, viewDetails }: Props) => {
  const [state, setState] = useState<PendingState>(PendingState.PENDING);
  const { header, description, illustration } = states[state];

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
      <Box variant="rowAlign" justifyContent="center">
        <img src={illustration} />
      </Box>
      <Button colorScheme="inverted" fullwidth={true} onClick={viewDetails}>
        {translateRaw('VIEW_TRANSACTION_DETAILS')}
      </Button>
    </Box>
  );
};
