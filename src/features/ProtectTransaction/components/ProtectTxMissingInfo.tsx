import { FC } from 'react';

import infoSVG from 'assets/images/icn-info-blue.svg';
import styled from 'styled-components';

import { SPACING } from '@theme';
import { translateRaw } from '@translations';

const Wrapper = styled.div`
  margin-top: ${SPACING.SM};
`;

const Content = styled.p`
  margin-bottom: ${SPACING.SM};
`;

export const ProtectTxMissingInfo: FC = () => {
  return (
    <Wrapper>
      <img height="42px" width="42px" src={infoSVG} />
      <h4>{translateRaw('MISSING_INFORMATION')}</h4>
      <Content>{translateRaw('PTX_MISSING_INFORMATION_DESCRIPTION')}</Content>
    </Wrapper>
  );
};
