import styled from 'styled-components';

import { SPACING } from '@theme';
import translate, { translateRaw } from '@translations';

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
      <SubContainer>{translateRaw('ZAPS_AVAIL')}</SubContainer>
      <SubContainer>
        <ul>
          <li>{translateRaw('ZAPS_AVAIL_DAI_UNIPOOL')}</li>
          <li>{translateRaw('ZAPS_AVAIL_SETH_UNIPOOL')}</li>
          <li>{translateRaw('ZAPS_AVAIL_COMPOUND_POOL')}</li>
        </ul>
      </SubContainer>
      <SubContainer>
        <div>{translate('ZAPS_AVAIL_NOTIF')}</div>
      </SubContainer>
    </Container>
  );
};
