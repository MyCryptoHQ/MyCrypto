import React, { useContext } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { RouterLink, Tooltip } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { COLORS, BREAK_POINTS, FONT_SIZE, SPACING } from 'v2/theme';

import { fetchZapRiskObject, IZapConfig } from '../config';
import { weiToFloat } from 'v2/utils';
import { StoreContext, getTotalByAsset } from 'v2/services';
import { translateRaw } from 'v2/translations';

interface SProps {
  isOwned?: boolean;
}

const ZapCardContainer = styled('li')`
  background: #ffffff;
  border: 1px solid ${(props: SProps) => (props.isOwned ? COLORS.LIGHT_GREEN : COLORS.BLUE_BRIGHT)};
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 0px;
  &:not(:last-child) {
    margin-bottom: ${SPACING.BASE};
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    &:not(:last-child) {
      margin-right: ${SPACING.BASE};
      margin-bottom: 0px;
    }
  }
`;

const ZapCardHeader = styled('div')`
  display: flex;
  background: ${(props: SProps) => (props.isOwned ? COLORS.LIGHT_GREEN : COLORS.BLUE_BRIGHT)};
  height: 49px;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  padding: ${SPACING.XS} ${SPACING.SM};
`;

const ZapCardContent = styled('div')`
  display: flex;
  flex: 1;
  padding: 0px ${SPACING.BASE} 0 ${SPACING.BASE};
  flex-direction: column;
`;

const ZapCardContentText = styled.p`
  padding: ${SPACING.BASE} 0px;
`;

const ZapCardContentRow = styled('div')`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const ZapCardContentBottom = styled('div')`
  display: flex;
  padding: 15px 15px;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: row;
  & a {
    &:not(:first-child) {
      margin-left: ${SPACING.SM};
      margin-top: 0px;
    }
  }

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    & a {
      &:not(:first-child) {
        margin-top: ${SPACING.SM};
        margin-left: 0px;
      }
    }
  }
`;

const ZapCardContentHeaderRow = styled('div')`
  margin: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const ZapCardHeaderTextSection = styled('div')`
  display: flex;
  justify-content: left;
  flex-direction: column;
  margin-left: 1em;
`;

const ZapCardHeaderTitle = styled.h5`
  font-weight: bold;
`;

const ZapCardHeaderName = styled.p`
  color: ${COLORS.GREY};
`;

const ZapCardImgSection = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ZapCardRiskProfile = styled('div')`
  margin-left: 0.5em;
`;

const ZapCardButton = styled(Button)`
  display: flex;
  flex: 1;
  min-height: 60px;
  background-color: ${COLORS.WHITE};
  color: ${COLORS.BLUE_LIGHT_DARKISH};
  border: 2px solid ${COLORS.BLUE_LIGHT_DARKISH};
  border-radius: 3px;
  font-size: ${FONT_SIZE.MD};
  font-weight: normal;
  padding: 0px 15px;
  &:hover {
    background-color: ${COLORS.BLUE_LIGHT_DARKISH};
    color: ${COLORS.WHITE};
  }
`;

const ZapEstimatedBalance = styled.p`
  font-weight: bold;
  color: ${COLORS.BLUE_DARK};
`;

interface Props {
  config: IZapConfig;
}

const ZapCard = ({ config }: Props) => {
  const { accounts, assets } = useContext(StoreContext);
  const IndicatorItem = config.positionDetails;
  const userZapBalances = getTotalByAsset(
    assets(accounts).filter(({ uuid }) => uuid === config.poolTokenUUID)
  )[config.poolTokenUUID];
  console.debug(
    '[zapId: ' + config.key.substr(0, 5) + ']: balance = ',
    userZapBalances,
    ' uuid: ',
    config.poolTokenUUID
  );

  const humanReadableZapBalance = userZapBalances
    ? weiToFloat(userZapBalances.balance, userZapBalances.decimal)
    : undefined;
  if (humanReadableZapBalance) {
    console.debug('[zap human-readable balance]: ', humanReadableZapBalance);
  }
  const isZapOwned = !!humanReadableZapBalance;
  return (
    <ZapCardContainer isOwned={isZapOwned}>
      <ZapCardHeader isOwned={isZapOwned}>
        <img src={fetchZapRiskObject(config.risk).image} />
        <ZapCardRiskProfile>{`${
          fetchZapRiskObject(config.risk).text
        } Risk Profile`}</ZapCardRiskProfile>
      </ZapCardHeader>
      <ZapCardContent>
        {!humanReadableZapBalance ? (
          <>
            <ZapCardContentHeaderRow>
              <ZapCardImgSection>
                <img src={'https://via.placeholder.com/52'} />
              </ZapCardImgSection>
              <ZapCardHeaderTextSection>
                <ZapCardHeaderTitle>{config.title}</ZapCardHeaderTitle>
                <ZapCardHeaderName>{config.name}</ZapCardHeaderName>
                <IndicatorItem />
              </ZapCardHeaderTextSection>
            </ZapCardContentHeaderRow>
            <ZapCardContentRow>
              <ZapCardContentText>{config.description}</ZapCardContentText>
            </ZapCardContentRow>
          </>
        ) : (
          <>
            <ZapCardContentHeaderRow>
              <ZapCardImgSection>
                <img src={'https://via.placeholder.com/52'} />
              </ZapCardImgSection>
              <ZapCardHeaderTextSection>
                <ZapCardHeaderTitle>{config.title}</ZapCardHeaderTitle>
                <ZapCardHeaderName>{config.name}</ZapCardHeaderName>
                <IndicatorItem />
              </ZapCardHeaderTextSection>
            </ZapCardContentHeaderRow>
            <ZapCardContentRow>
              <ZapCardContentText>You seem to have a balance of this already!</ZapCardContentText>
              <ZapCardContentText>
                <ZapEstimatedBalance>
                  {translateRaw('ZAP_ESTIMATED_BALANCE')}{' '}
                  <Tooltip
                    tooltip={translateRaw('ZAP_BALANCE_TOOLTIP', {
                      $protocol: config.platformsUsed[0]
                    })}
                  />
                  {`: `}
                </ZapEstimatedBalance>
                {`${humanReadableZapBalance.toFixed(4)} ${userZapBalances.ticker}`}
              </ZapCardContentText>
            </ZapCardContentRow>
          </>
        )}
      </ZapCardContent>
      <ZapCardContentBottom>
        {!humanReadableZapBalance ? (
          <RouterLink to={`${ROUTE_PATHS.DEFIZAP.path}/zap?key=${config.key}`}>
            <ZapCardButton>{config.ctaText}</ZapCardButton>
          </RouterLink>
        ) : (
          <>
            <RouterLink to={`${ROUTE_PATHS.DEFIZAP.path}/zap?key=${config.key}`}>
              <ZapCardButton>{translateRaw('ADD')}</ZapCardButton>
            </RouterLink>
            <a href={`https://defizap.com/zaps/${config.key}`}>
              <ZapCardButton>{translateRaw('WITHDRAW')}</ZapCardButton>
            </a>
          </>
        )}
      </ZapCardContentBottom>
    </ZapCardContainer>
  );
};

export default ZapCard;
