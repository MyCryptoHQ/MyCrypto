import React from 'react';
import styled from 'styled-components';
import { SPACING } from 'v2/theme';
import { TranslateMarkdown } from 'v2/components/TranslateMarkdown';

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
        {'MyCrypto’s DeFiZap integration will initially allow you to access three Zaps:'}
      </SubContainer>
      <SubContainer>
        <ul>
          <li>
            {
              'DAI Unipool: Swaps 50% of ETH for DAI (using Uniswap) and contributes both ETH & DAI to Uniswap DAI Pool.'
            }
          </li>
          <li>
            {
              'sETH Unipool: Swaps 50% of ETH for sETH (using Uniswap) and contributes both ETH & sETH to the Uniswap sETH Pool.'
            }
          </li>
          <li>
            {
              'Compound Dai Pool: Swaps 100% of ETH for DAI (using Kyber Network) and contributes it to Compound.'
            }
          </li>
        </ul>
      </SubContainer>
      <SubContainer>
        <div>
          <TranslateMarkdown
            source={
              'We’ll be working to add more Zaps over time, but you can access all of the Zaps via [DeFiZap.com](https://defizap.com).'
            }
          />
        </div>
      </SubContainer>
    </Container>
  );
};
