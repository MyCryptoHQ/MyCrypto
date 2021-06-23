import styled from 'styled-components';

import { Icon } from '@components';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';

import { ProtocolTagsList } from '.';
import { IZapConfig } from '../config';

const SIcon = styled(Icon)`
  width: 30px;
  height: 30px;
  margin-right: ${SPACING.SM};
  vertical-align: middle;
`;

export const ZapReceiptBanner = ({ zapSelected }: { zapSelected: IZapConfig }) => (
  <>
    <div className="TransactionReceipt-row">
      <div className="TransactionReceipt-row-column">
        <SIcon type="zapperLogo" />
        {translateRaw('ZAP_NAME')}
      </div>
      <div className="TransactionReceipt-row-column rightAligned">{zapSelected.title}</div>
    </div>
    <div className="TransactionReceipt-row">
      <div className="TransactionReceipt-row-column">
        <SIcon type="zapper-platform" />
        {translateRaw('PLATFORMS')}
      </div>
      <div className="TransactionReceipt-row-column rightAligned">
        <ProtocolTagsList platformsUsed={zapSelected.platformsUsed} />
      </div>
    </div>
  </>
);
