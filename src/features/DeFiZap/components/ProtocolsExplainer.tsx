import styled from 'styled-components';

import { LinkApp } from '@components';
import { SPACING } from '@theme';
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
        <LinkApp href="https://compound.finance" isExternal={true}>
          {translateRaw('PROTOCOLS_EXPLAINER_COMPOUND')}:
        </LinkApp>
        {translateRaw('PROTOCOLS_EXPLAINER_COMPOUND_DESC')}
      </SubContainer>
      <SubContainer>
        <LinkApp href="https://kyber.network" isExternal={true}>
          {translateRaw('PROTOCOLS_EXPLAINER_KYBER')}:
        </LinkApp>
        {translateRaw('PROTOCOLS_EXPLAINER_KYBER_DESC')}
      </SubContainer>
      <SubContainer>
        <LinkApp href="https://uniswap.io" isExternal={true}>
          {translateRaw('PROTOCOLS_EXPLAINER_UNISWAP')}:
        </LinkApp>
        {translateRaw('PROTOCOLS_EXPLAINER_UNISWAP_DESC')}
      </SubContainer>
      <SubContainer>
        <LinkApp href="https://synthetix.exchange" isExternal={true}>
          {translateRaw('PROTOCOLS_EXPLAINER_SYNTHETIX')}:
        </LinkApp>
        {translateRaw('PROTOCOLS_EXPLAINER_SYNTHETIX_DESC')}
      </SubContainer>
    </Container>
  );
};
