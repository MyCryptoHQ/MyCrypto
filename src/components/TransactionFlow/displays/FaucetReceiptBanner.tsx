import styled from 'styled-components';

import { Currency } from '@components';
import { default as Icon } from '@components/Icon';
import { useAssets } from '@services';
import { SPACING } from '@theme';
import translate from '@translations';
import { Network } from '@types';
import { bigify, fromWei, Wei } from '@utils';

const SIcon = styled(Icon)`
  vertical-align: middle;
  margin-right: ${SPACING.SM};
`;

export const FaucetReceiptBanner = ({
  network,
  received
}: {
  network: Network;
  received: string;
}) => {
  const { getAssetByUUID } = useAssets();
  const baseAsset = getAssetByUUID(network.baseAsset)!;
  const formattedReceived = bigify(fromWei(Wei(received), 'ether')).toFixed(6);
  return (
    <>
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-network" height={'25px'} />
          {translate('NETWORK')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">{network.name}</div>
      </div>
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-receive" height={'25px'} />
          {translate('CONFIRM_TX_RECEIVED')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <Currency amount={formattedReceived} ticker={baseAsset.ticker} />
        </div>
      </div>
    </>
  );
};
