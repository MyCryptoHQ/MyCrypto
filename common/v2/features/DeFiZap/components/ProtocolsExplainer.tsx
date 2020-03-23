import React from 'react';
import styled from 'styled-components';
import { SPACING } from 'v2/theme';
import { Link } from 'v2/components';

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
        <Link href="https://compound.finance">Compound:</Link>
        {
          'Compound is a protocol that allows you to borrow and lend assets. Lending assets yields returns in the form of an interest rate.'
        }
      </SubContainer>
      <SubContainer>
        <Link href="https://kyber.network">Kyber:</Link>
        {'Kyber is a protocol that allows the exchange of cryptocurrencies.'}
      </SubContainer>
      <SubContainer>
        <Link href="https://uniswap.io">Uniswap:</Link>
        {
          'Uniswap is a protocol that allows the exchange of cryptocurrencies. Uniswap allows users to contribute liquidity to pools, and liquidity providers yield returns in the form of transfer fees.'
        }
      </SubContainer>
      <SubContainer>
        <Link href="https://synthetix.exchange">Synthetix:</Link>
        {
          'Synthetix is a synthetic asset platform that allows users to gain exposure to forex, cryptocurrencies, and commodities trading.'
        }
      </SubContainer>
    </Container>
  );
};
