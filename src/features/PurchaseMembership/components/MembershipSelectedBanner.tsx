import styled from 'styled-components';

import { Tooltip, Typography } from '@components';
import { useAssets } from '@services';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { Asset } from '@types';

import { IMembershipConfig } from '../config';

interface Props {
  membershipSelected: IMembershipConfig;
}

const BannerContainer = styled.div`
  display: flex;
  flex: 1;
  padding: ${SPACING.BASE};
  flex-direction: row;
  background-color: ${COLORS.GREY_LIGHTEST};
  margin-bottom: ${SPACING.MD};
  justify-content: space-between;
`;

const MembershipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-right: ${SPACING.SM};
`;

const Icon = styled.img`
  width: 45px;
  height: 48px;
`;

const CostWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CostText = styled(Typography)`
  margin-right: ${SPACING.BASE};
`;

const MembershipSelectedBanner = ({ membershipSelected }: Props) => {
  const { assets } = useAssets();
  const asset = assets.find((a) => a.uuid === membershipSelected.assetUUID) as Asset;
  return (
    <BannerContainer>
      <MembershipWrapper>
        <IconWrapper>
          <Icon src={membershipSelected.icon} />
        </IconWrapper>
        <div>
          <Typography as="div" bold={true}>
            {translateRaw('MEMBERSHIP_DETAILS')}
          </Typography>
          <Typography as="div">{membershipSelected.title}</Typography>
        </div>
      </MembershipWrapper>
      <CostWrapper>
        <CostText as="div">
          {translateRaw('COST')} <Tooltip tooltip={translateRaw('MEMBERSHIP_COST_TOOLTIP')} />
        </CostText>
        <Typography
          as="div"
          bold={true}
          fontSize={FONT_SIZE.XL}
          style={{ color: COLORS.BLUE_DARK }}
        >
          {membershipSelected.price} {asset.ticker}
        </Typography>
      </CostWrapper>
    </BannerContainer>
  );
};

export default MembershipSelectedBanner;
