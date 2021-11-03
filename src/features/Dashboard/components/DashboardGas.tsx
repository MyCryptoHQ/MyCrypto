import React from 'react';

import BigNumber from 'bignumber.js';

import { Box } from '@components';
import { ETHUUID } from '@config';
import { useRates } from '@services/Rates';
import { getBaseFee, getFiatInformation, useSelector } from '@store';
import { getAssetByUUID } from '@store/asset.slice';
import { translateRaw } from '@translations';
import { TUuid } from '@types';
import { bigify, formatCurrency, fromWei } from '@utils';

import ActionTile from './ActionTile';

export const DashboardGas = () => {
  const baseFee = useSelector(getBaseFee);
  const ethAsset = useSelector(getAssetByUUID(ETHUUID as TUuid))!;
  const { getAssetRate } = useRates();
  const fiat = useSelector(getFiatInformation);

  const baseFeeGwei =
    baseFee && bigify(fromWei(baseFee, 'gwei')).integerValue(BigNumber.ROUND_HALF_UP);
  const baseFeeEther = baseFee && bigify(fromWei(baseFee, 'ether'));

  const baseAssetRate = getAssetRate(ethAsset);
  const fiatValue =
    baseFeeEther &&
    baseFeeEther
      .multipliedBy(21000)
      .multipliedBy(baseAssetRate)
      .integerValue(BigNumber.ROUND_HALF_UP);

  return (
    <Box variant="rowAlign" justifyContent="space-between">
      <Box width="48%">
        <ActionTile
          link="#"
          title={baseFeeGwei ? `${baseFeeGwei.toString(10)} ${translateRaw('GWEI')}` : '?'}
          description={translateRaw('CURRENT_BASE_FEE_TEXT')}
          justifyContent="flex-start"
        />
      </Box>
      <Box width="48%">
        <ActionTile
          link="#"
          title={fiatValue ? `${formatCurrency(fiatValue.toString(10), 0, fiat?.ticker)}` : '?'}
          description={translateRaw('ETH_TRANSFER_FEE')}
          justifyContent="flex-start"
        />
      </Box>
    </Box>
  );
};
