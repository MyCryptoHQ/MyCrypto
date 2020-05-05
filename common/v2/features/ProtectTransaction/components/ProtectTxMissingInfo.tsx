import React, { FC } from 'react';
import styled from 'styled-components';
import { SPACING } from 'v2/theme';

import infoSVG from 'assets/images/icn-info-blue.svg';
import { translateRaw } from 'v2/translations';

const Wrapper = styled.div`
  margin-top: ${SPACING.MD};
`;

const Content = styled.p`
  margin-bottom: ${SPACING.MD};
`;

export const ProtectTxMissingInfo: FC = () => {
  return (
    <Wrapper>
      <img height={SPACING.LG} width={SPACING.LG} src={infoSVG} />
      <h4>{translateRaw('MISSING_INFORMATION')}</h4>
      <Content>{translateRaw('PTX_MISSING_INFORMATION_DESCRIPTION')}</Content>
    </Wrapper>
  );
};
