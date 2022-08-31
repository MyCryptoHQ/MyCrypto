import styled from 'styled-components';

import { AssetIcon, Box, Currency, DashboardPanel, Icon, LinkApp } from '@components';
import { getFiat } from '@config/fiats';
import { getNetworkById, useSettings } from '@services/Store';
import { selectNetworks, useSelector } from '@store';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { Social, StoreAsset, TAddress } from '@types';
import { buildTokenUrl, weiToFloat } from '@utils';

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 160px;
`;

const InfoTitle = styled.div`
  font-size: ${FONT_SIZE.XS};
  letter-spacing: 0.1em;
  font-weight: 900;
  color: ${COLORS.GREY_DARKER};
  text-transform: uppercase;
  margin-bottom: 2px;
`;

const InfoValue = styled(Box)`
  font-size: ${FONT_SIZE.MD};
  font-weight: normal;
  word-break: break-all;
  color: ${COLORS.GREY_DARKEST};
`;

interface SectionProps {
  noMargin?: boolean;
}

const Section = styled.div<SectionProps>`
  margin-top: ${(props) => (props.noMargin ? 0 : '23px')};
`;

const TwoColumnsWrapper = styled.div`
  display: flex;
`;

const DetailsHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.1;
`;

const StyledIcon = styled(Icon)`
  height: auto;
  transition: 100ms transform;
  &:hover {
    transition: 100ms transform;
    transform: scale(1.1);
  }
  width: 40px;
  padding: ${SPACING.SM};
`;

const BackIcon = styled(StyledIcon)`
  margin-left: -${SPACING.SM};
`;

const TokenIcon = styled.div`
  margin-right: ${SPACING.SM};
  display: flex;
`;

const SIcon = styled(StyledIcon)`
  width: 46px;
`;

interface InfoPieceProps {
  title: string;
  value: string | number | JSX.Element | undefined;
}

function InfoPiece(props: InfoPieceProps) {
  const { title, value } = props;
  return (
    <InfoWrapper>
      <InfoTitle>{title}</InfoTitle>
      <InfoValue>{value}</InfoValue>
    </InfoWrapper>
  );
}

type ISocialNetwork = {
  [key in Social]: string;
};

const supportedSocialNetworks: ISocialNetwork = {
  [Social.TELEGRAM]: 'telegram',
  [Social.TWITTER]: 'twitter',
  [Social.REDDIT]: 'reddit',
  [Social.GITHUB]: 'github',
  [Social.FACEBOOK]: 'facebook',
  [Social.SLACK]: 'slack',
  [Social.CMC]: 'coinmarketcap'
};

interface Props {
  currentToken: StoreAsset;
  setShowDetailsView(setShowDetailsView: boolean): void;
}

export function TokenDetails(props: Props) {
  const { currentToken, setShowDetailsView } = props;
  const {
    website,
    whitepaper,
    social = {},
    networkId,
    rate = 0,
    balance,
    decimal,
    ticker,
    contractAddress
  } = currentToken;
  const networks = useSelector(selectNetworks);
  const { settings } = useSettings();
  const network = getNetworkById(networkId, networks);

  const contractUrl = buildTokenUrl(network.blockExplorer, contractAddress as TAddress);

  // Find available supported social links
  const filteredSocial = Object.keys(social).filter((key: Social) =>
    Object.prototype.hasOwnProperty.call(supportedSocialNetworks, key)
  );

  return (
    <DashboardPanel
      heading={
        <DetailsHeadingWrapper>
          <BackIcon type="back" onClick={() => setShowDetailsView(false)} />
          <TokenIcon>
            <AssetIcon uuid={currentToken.uuid} size={'30px'} />
          </TokenIcon>
          {currentToken.name}
        </DetailsHeadingWrapper>
      }
      headingRight={
        <LinkApp href={contractUrl} isExternal={true}>
          <Icon type="expand" />
        </LinkApp>
      }
      padChildren={true}
    >
      <Section noMargin={true}>
        <TwoColumnsWrapper>
          <InfoPiece
            title={translateRaw('LATEST_PRICE')}
            value={
              <Currency
                color={COLORS.GREY_DARKEST}
                fontSize={FONT_SIZE.MD}
                symbol={getFiat(settings).symbol}
                ticker={getFiat(settings).ticker}
                amount={rate.toString()}
                decimals={2}
              />
            }
          />{' '}
          <InfoPiece
            title={translateRaw('BALANCE')}
            value={`${weiToFloat(balance, decimal).toFixed(6)} ${ticker}`}
          />
        </TwoColumnsWrapper>
      </Section>
      <Section>
        <InfoPiece title={translateRaw('TOKEN_ADDRESS')} value={contractAddress} />
      </Section>
      <TwoColumnsWrapper>
        <Section>
          <InfoPiece title={translateRaw('TOKEN_DECIMALS')} value={decimal} />
        </Section>
        <Section>
          <InfoPiece title={translateRaw('TOKEN_SYMBOL')} value={ticker} />
        </Section>
      </TwoColumnsWrapper>
      {filteredSocial.length > 0 && (
        <Section>
          <InfoWrapper>
            <InfoTitle>{translateRaw('RESOURCES')}</InfoTitle>
            <InfoValue ml={`-${SPACING.SM}`}>
              {website && (
                <LinkApp href={website} isExternal={true} variant="barren">
                  <SIcon type="website" />
                </LinkApp>
              )}
              {whitepaper && (
                <LinkApp href={whitepaper} isExternal={true} variant="barren">
                  <SIcon type="whitepaper" />
                </LinkApp>
              )}
              {social &&
                filteredSocial.map((s: Social) => (
                  <LinkApp key={s} href={social[s] as string} isExternal={true} variant="barren">
                    <SIcon alt={s} type={supportedSocialNetworks[s]} color="BLUE_DARK_SLATE" />
                  </LinkApp>
                ))}
            </InfoValue>
          </InfoWrapper>
        </Section>
      )}
    </DashboardPanel>
  );
}
