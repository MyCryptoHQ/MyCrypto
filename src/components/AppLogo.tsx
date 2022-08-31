import styled from 'styled-components';

import Icon from '@components/Icon';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 135px;
  height: 29px;
  border: 1px solid ${COLORS.BLUE_MYC};
  border-radius: 3px;
  font-size: 14px;
  color: ${COLORS.BLUE_MYC};
  font-weight: bold;
`;

export default () => {
  return (
    <Container>
      <Icon type="logo-mycrypto" width="18px" />
      {translateRaw('MYCRYPTO_APP')}
    </Container>
  );
};
