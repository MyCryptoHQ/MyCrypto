import styled from 'styled-components';

import membershipIllustration from '@assets/images/membership/membership-illustration.svg';
import { FullSizeContentPanel, Typography } from '@components';
import { BREAK_POINTS, SPACING } from '@theme';
import translate from '@translations';

import { FullSizePanelSection, RowPanelSection } from '../../../components/FullSizeContentPanel';

const Heading = styled(FullSizePanelSection)`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: ${SPACING.BASE} ${SPACING.LG} 0 ${SPACING.XL};
  }
  display: flex;
  padding: ${SPACING.LG} ${SPACING.XL} 0 ${SPACING.XL};
  align-items: flex-start;
  font-size: 24px;
  font-weight: bold;
`;

const SImg = styled.img`
  @media screen and (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    padding: 0 ${SPACING.XXL};
  }
  @media screen and (min-width: ${BREAK_POINTS.SCREEN_SM}) and (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    padding-right: ${SPACING.LG};
  }

  width: 50%;
  height: auto;
  align-self: center;
`;

const DescriptionColumn = styled.div`
  margin-top: ${SPACING.XL};
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    margin-top: ${SPACING.BASE};
  }
  display: flex;
  flex-direction: column;
  & > *:not(:first-child) {
    margin-top: ${SPACING.LG};
  }
`;

const MembershipDescription = styled(Typography)`
  margin-top: 1rem !important;
`;

const MembershipEducation = () => {
  return (
    <FullSizeContentPanel width={'1100px'}>
      <Heading>{translate('MEMBERSHIP')}</Heading>
      <RowPanelSection>
        <SImg src={membershipIllustration} />
        <DescriptionColumn>
          <MembershipDescription>{translate('MEMBERSHIP_DESC_FIRST')}</MembershipDescription>
          <MembershipDescription>{translate('MEMBERSHIP_DESC_SECOND')}</MembershipDescription>
        </DescriptionColumn>
      </RowPanelSection>
    </FullSizeContentPanel>
  );
};

export default MembershipEducation;
