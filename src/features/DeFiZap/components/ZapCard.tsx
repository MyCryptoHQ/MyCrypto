import React, { useContext } from 'react';
import styled from 'styled-components';
import { formatEther } from 'ethers/utils';

import { RouterLink, Tooltip, Button } from '@components';
import { ROUTE_PATHS } from '@config';
import { COLORS, BREAK_POINTS, FONT_SIZE, SPACING } from '@theme';
import { weiToFloat, trimBN } from '@utils';
import { StoreContext, getTotalByAsset, RatesContext } from '@services';
import translate, { translateRaw } from '@translations';
import { IconID } from '@components/Tooltip';

import { fetchZapRiskObject, IZapConfig } from '../config';

interface SProps {
  isOwned?: boolean;
}

const ZapCardContainer = styled.div`
  background: #ffffff;
  border: 1px solid ${(props: SProps) => (props.isOwned ? COLORS.LIGHT_GREEN : COLORS.BLUE_BRIGHT)};
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 0px;
  &:not(:last-child) {
    margin-bottom: ${SPACING.SM};
  }
  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    &:not(:last-child) {
      margin-right: ${SPACING.SM};
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
  justify-content: flex-start;
`;

const ZapCardContentText = styled.p`
  padding-bottom: ${SPACING.SM};
  margin-bottom: 0px;
`;

const ZapCardContentRow = styled('div')`
  align-items: center;
  justify-content: center;
  margin-bottom: ${SPACING.SM};
  & p {
    &:last-child {
      margin-bottom: 0px;
      padding-bottom: 0px;
    }
  }
`;

const ZapContentAmountRow = styled(ZapCardContentRow)`
  flex: 1;
  justify-content: flex-start;
`;

const ZapCardContentBottom = styled('div')`
  display: flex;
  padding: 15px 15px;
  align-items: stretch + center;
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
  & a {
    width: 100%;
    &:not(:first-child) {
      margin-top: 0px;
    }
    :first-child {
      margin-right: ${SPACING.XS};
    }
    :last-child {
      margin-left: ${SPACING.XS};
    }
    :first-child:last-child {
      margin-left: 0;
      margin-right: 0;
    }
  }
  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) and (max-width: ${BREAK_POINTS.SCREEN_MD}) {
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
  margin: ${SPACING.BASE} 0px 0px 0px;
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: center;
`;

const ZapCardHeaderTextSection = styled('div')`
  display: flex;
  justify-content: left;
  flex-direction: column;
  margin-left: 0.5em;
`;

const ZapCardHeaderTitle = styled.h5`
  font-weight: bold;
  margin-top: 0px;
`;

const ZapCardHeaderName = styled.p`
  color: ${COLORS.GREY};
`;

const ZapCardImgSection = styled('div')`
  display: flex;
  align-items: top;
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
  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) and (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    width: 100%;
  }
  display: flex;
  flex: 1 auto;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0;
  font-size: ${FONT_SIZE.MD};
`;

const ZapEstimatedBalance = styled.div`
  position: relative;
  display: flex;
  font-weight: bold;
  width: 80px;
  @media (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    margin-bottom: ${SPACING.SM};
  }
`;

const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  font-weight: bold;
  color: ${COLORS.BLUE_DARK};
  line-height: 17px;
  font-size: 16px;
  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) and (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    flex-direction: column;
  }
`;

const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  & > * {
    margin-bottom: ${SPACING.XS};
  }
  @media (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    align-items: flex-start;
  }
`;

const TooltipWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 2px;
`;

interface Props {
  config: IZapConfig;
}

const ZapCard = ({ config }: Props) => {
  const { getPoolAssetReserveRate } = useContext(RatesContext);
  const { currentAccounts, assets, getDeFiAssetReserveAssets } = useContext(StoreContext);
  const IndicatorItem = config.positionDetails;
  const defiPoolBalances = assets(currentAccounts).filter(
    ({ uuid }) => uuid === config.poolTokenUUID
  );
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
        <ZapContentAmountRow>
          {!humanReadableZapBalance ? (
            <ZapCardContentText>{config.description}</ZapCardContentText>
          ) : (
            <>
              <ZapCardContentText>{translateRaw('ZAP_BALANCE_DETECTED')}</ZapCardContentText>
              <BalanceWrapper>
                <ZapEstimatedBalance>
                  {translateRaw('ZAP_ESTIMATED_BALANCE')}{' '}
                  <TooltipWrapper>
                    <Tooltip
                      tooltip={translateRaw('ZAP_BALANCE_TOOLTIP', {
                        $protocol: config.platformsUsed[0]
                      })}
                      type={IconID.informational}
                    />
                  </TooltipWrapper>
                </ZapEstimatedBalance>
                <AmountContainer>
                  {defiReserveBalances && defiReserveBalances.length > 0 ? (
                    defiReserveBalances.map((defiReserveAsset) => (
                      <div key={defiReserveAsset.uuid}>
                        {`~ ${parseFloat(
                          trimBN(formatEther(defiReserveAsset.balance.toString()))
                        ).toFixed(4)} ${defiReserveAsset.ticker}`}
                      </div>
                    ))
                  ) : (
                    <ZapCardContentText>
                      {`(${humanReadableZapBalance.toFixed(4)} ${userZapBalances.ticker})`}
                    </ZapCardContentText>
                  )}
                </AmountContainer>
              </BalanceWrapper>
            </>
          )}
        </ZapContentAmountRow>
      </ZapCardContent>
      <ZapCardContentBottom>
        {!humanReadableZapBalance ? (
          <RouterLink to={`${ROUTE_PATHS.DEFIZAP.path}/zap?key=${config.key}`}>
            <ZapCardButton inverted={true}>{translateRaw('ZAP_CARD_CTA')}</ZapCardButton>
          </RouterLink>
        ) : (
          <>
            <RouterLink to={`${ROUTE_PATHS.DEFIZAP.path}/zap?key=${config.key}`}>
              <ZapCardButton inverted={true}>{translateRaw('ADD')}</ZapCardButton>
            </RouterLink>
            <a target="_blank" href={config.link} rel="noreferrer">
              <Tooltip tooltip={translate('ZAP_WITHDRAW_TOOLTIP')}>
                <ZapCardButton inverted={true}>{translateRaw('WITHDRAW')}</ZapCardButton>
              </Tooltip>
            </a>
          </>
        )}
      </ZapCardContentBottom>
    </ZapCardContainer>
  );
};

export default ZapCard;
