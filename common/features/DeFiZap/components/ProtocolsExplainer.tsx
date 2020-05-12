import React from 'react';
import styled from 'styled-components';
import { SPACING } from '@theme';
import { Link } from '@components';
import { translateRaw } from '@translations';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const SubContainer = styled(Container)`
  margin-bottom: ${SPACING.BASE};
`;

export default () => {
  return (
    <Container>
      <SubContainer>
        <Link href="https://compound.finance">{translateRaw('PROTOCOLS_EXPLAINER_COMPOUND')}:</Link>
        {translateRaw('PROTOCOLS_EXPLAINER_COMPOUND_DESC')}
      </SubContainer>
      <SubContainer>
        <Link href="https://kyber.network">{translateRaw('PROTOCOLS_EXPLAINER_KYBER')}:</Link>
        {translateRaw('PROTOCOLS_EXPLAINER_KYBER_DESC')}
      </SubContainer>
      <SubContainer>
        <Link href="https://uniswap.io">{translateRaw('PROTOCOLS_EXPLAINER_UNISWAP')}:</Link>
        {translateRaw('PROTOCOLS_EXPLAINER_UNISWAP_DESC')}
      </SubContainer>
      <SubContainer>
        <Link href="https://synthetix.exchange">
          {translateRaw('PROTOCOLS_EXPLAINER_SYNTHETIX')}:
        </Link>
        {translateRaw('PROTOCOLS_EXPLAINER_SYNTHETIX_DESC')}
      </SubContainer>
    </Container>
  );
};
