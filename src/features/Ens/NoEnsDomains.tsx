import styled from 'styled-components';

import { COLORS, FONT_SIZE, SPACING } from '@theme';
import translate from '@translations';

const { BLUE_BRIGHT } = COLORS;

const NoDomainsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${SPACING.NONE} ${SPACING.BASE} ${SPACING.BASE} ${SPACING.BASE};
  width: 100%;
`;

const NoDomainsCenter = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: ${SPACING.BASE};
  margin-bottom: ${SPACING.LG};
`;

const NoDomainsHeading = styled.div`
  color: ${COLORS.BLUE_GREY};
  font-size: ${FONT_SIZE.XL};
  font-weight: bold;
  text-align: center;
  margin-top: ${SPACING.SM};
  margin-bottom: ${SPACING.SM};
`;

const NoDomainsDescription = styled.div`
  color: ${COLORS.BLUE_GREY};
  text-align: center;
  font-weight: normal;
  > a {
    color: ${BLUE_BRIGHT};
  }
`;

export default function NoDomains() {
  return (
    <NoDomainsWrapper>
      <NoDomainsCenter>
        <NoDomainsHeading>{translate('ENS_DOMAINS_NO_DOMAINS')}</NoDomainsHeading>
        <NoDomainsDescription>{translate('ENS_DOMAINS_NO_DOMAINS_MORE')}</NoDomainsDescription>
      </NoDomainsCenter>
    </NoDomainsWrapper>
  );
}
