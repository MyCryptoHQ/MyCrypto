import React from 'react';

import styled from 'styled-components';

import zapperLogo from '@assets/images/defizap/zapperLogo.svg';
import platformUsed from '@assets/images/icn-platform-used.svg';
import { translateRaw } from '@translations';

import { ProtocolTagsList } from '.';
import { IZapConfig } from '../config';

const SImg = styled('img')`
  height: ${(p: { size: string }) => p.size};
  width: ${(p: { size: string }) => p.size};
`;

export const ZapReceiptBanner = ({ zapSelected }: { zapSelected: IZapConfig }) => (
  <>
    <div className="TransactionReceipt-row">
      <div className="TransactionReceipt-row-column">
        <SImg src={zapperLogo} size="24px" />
        {translateRaw('ZAP_NAME')}
      </div>
      <div className="TransactionReceipt-row-column rightAligned">{zapSelected.title}</div>
    </div>
    <div className="TransactionReceipt-row">
      <div className="TransactionReceipt-row-column">
        <SImg src={platformUsed} size="24px" />
        {translateRaw('PLATFORMS')}
      </div>
      <div className="TransactionReceipt-row-column rightAligned">
        <ProtocolTagsList platformsUsed={zapSelected.platformsUsed} />
      </div>
    </div>
  </>
);
