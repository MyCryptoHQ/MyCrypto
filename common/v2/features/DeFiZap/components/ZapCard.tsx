import React, { useContext } from 'react';
import styled from 'styled-components';
import { formatEther } from 'ethers/utils';

import { RouterLink, Tooltip, Button } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { COLORS, BREAK_POINTS, FONT_SIZE, SPACING } from 'v2/theme';
import { weiToFloat, trimBN } from 'v2/utils';
import { StoreContext, getTotalByAsset, RatesContext } from 'v2/services';
import { translateRaw } from 'v2/translations';

import { fetchZapRiskObject, IZapConfig } from '../config';

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
  padding: 0px ${SPACING.BASE} 0px ${SPACING.BASE};
  flex-direction: column;
`;

const ZapCardContentText = styled.div`
  padding: ${SPACING.SM} 0px;
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

  @media (max-width: ${BREAK_POINTS.SCREEN_MD}) {
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
  margin-left: 0.5em;
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

const ZapCardImg = styled.img`
  min-width: 40px;
  overflow: hidden;
`;

const ZapCardRiskProfile = styled('div')`
  margin-left: 0.5em;
`;

const ZapCardButton = styled(Button)`
  display: flex;
  flex: 1;
  min-height: 60px;
  font-size: ${FONT_SIZE.MD};
  font-weight: normal;
  padding: 0px 15px;
`;

const ZapEstimatedBalance = styled.p`
  font-weight: bold;
  color: ${COLORS.BLUE_DARK};
`;

interface Props {
  config: IZapConfig;
}

const ZapCard = ({ config }: Props) => {
  const { getPoolAssetReserveRate } = useContext(RatesContext);
  const { accounts, assets, getDeFiAssetReserveAssets } = useContext(StoreContext);
  const IndicatorItem = config.positionDetails;
  const defiPoolBalances = assets(accounts).filter(({ uuid }) => uuid === config.poolTokenUUID);
  const userZapBalances = getTotalByAsset(defiPoolBalances)[config.poolTokenUUID];

  const humanReadableZapBalance = userZapBalances
    ? weiToFloat(userZapBalances.balance, userZapBalances.decimal)
    : undefined;

  const defiReserveBalances = !userZapBalances
    ? []
    : getDeFiAssetReserveAssets(userZapBalances)(getPoolAssetReserveRate);

  const isZapOwned = !!humanReadableZapBalance;

  return (
    <ZapCardContainer isOwned={isZapOwned}>
      <ZapCardHeader isOwned={isZapOwned}>
        <img src={fetchZapRiskObject(config.risk).image} />
        <ZapCardRiskProfile>
          {translateRaw('ZAP_RISK_PROFILE_HEADER_TEXT', {
            $riskProfile: fetchZapRiskObject(config.risk).text
          })}
        </ZapCardRiskProfile>
      </ZapCardHeader>
      <ZapCardContent>
        <ZapCardContentHeaderRow>
          <ZapCardImgSection>
            <Tooltip tooltip={config.breakdownTooltip}>
              <ZapCardImg src={config.breakdownImage} />
            </Tooltip>
          </ZapCardImgSection>
          <ZapCardHeaderTextSection>
            <ZapCardHeaderTitle>{config.title}</ZapCardHeaderTitle>
            <ZapCardHeaderName>{config.name}</ZapCardHeaderName>
          </ZapCardHeaderTextSection>
        </ZapCardContentHeaderRow>
        <ZapCardContentRow>
          <IndicatorItem />
        </ZapCardContentRow>
        <ZapCardContentRow>
          {!humanReadableZapBalance ? (
            <ZapCardContentText>{config.description}</ZapCardContentText>
          ) : (
            <>
              <ZapCardContentText>{translateRaw('ZAP_BALANCE_DETECTED')}</ZapCardContentText>
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

                {defiReserveBalances &&
                  defiReserveBalances.map(defiReserveAsset => (
                    <div key={defiReserveAsset.uuid}>
                      {`~ ${parseFloat(
                        trimBN(formatEther(defiReserveAsset.balance.toString()))
                      ).toFixed(4)} ${defiReserveAsset.ticker}`}
                    </div>
                  ))}
                {`(${humanReadableZapBalance.toFixed(4)} ${userZapBalances.ticker})`}
              </ZapCardContentText>
            </>
          )}
        </ZapCardContentRow>
      </ZapCardContent>
      <ZapCardContentBottom>
        {!humanReadableZapBalance ? (
          <RouterLink to={`${ROUTE_PATHS.DEFIZAP.path}/zap?key=${config.key}`}>
            <ZapCardButton inverted={true}>{config.ctaText}</ZapCardButton>
          </RouterLink>
        ) : (
          <>
            <RouterLink to={`${ROUTE_PATHS.DEFIZAP.path}/zap?key=${config.key}`}>
              <ZapCardButton inverted={true}>{translateRaw('ADD')}</ZapCardButton>
            </RouterLink>
            <a target="_blank" href={config.link} rel="noreferrer">
              <ZapCardButton inverted={true}>{translateRaw('WITHDRAW')}</ZapCardButton>
            </a>
          </>
        )}
      </ZapCardContentBottom>
    </ZapCardContainer>
  );
};

export default ZapCard;
