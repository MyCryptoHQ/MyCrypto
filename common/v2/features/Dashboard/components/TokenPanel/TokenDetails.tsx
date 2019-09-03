import React from 'react';
import styled from 'styled-components';

import { translateRaw } from 'translations';

import socialTelegram from 'common/assets/images/social-icons/social-telegram.svg';
import socialTwitter from 'common/assets/images/social-icons/social-twitter.svg';
import socialReddit from 'common/assets/images/social-icons/social-reddit.svg';
import socialGithub from 'common/assets/images/social-icons/social-github.svg';
import socialFacebook from 'common/assets/images/social-icons/social-facebook.svg';
import socialSlack from 'common/assets/images/social-icons/social-slack.svg';
import socialCmc from 'common/assets/images/social-icons/social-cmc.svg';
import websiteIcon from 'common/assets/images/icn-website.svg';
import whitepaperIcon from 'common/assets/images/icn-whitepaper.svg';

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 160px;
`;

const InfoTitle = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #000;
  text-transform: uppercase;
`;

const InfoValue = styled.div`
  font-size: 18px;
  line-height: 
  font-weight: normal;
`;

interface SectionProps {
  noMargin?: boolean;
}

const Section = styled.div<SectionProps>`
  margin-top: ${props => (props.noMargin ? 0 : '23px')};
`;

const TwoColumnsWrapper = styled.div`
  display: flex;
`;

const Icon = styled.img`
  width: 24px;
  height: auto;
  cursor: pointer;
  margin-right: 21px;
`;

const Resources = styled.div`
  display: flex;
`;

const ResourceItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 21px;
  cursor: pointer;
  color: #000;
`;

const ResourceIcon = styled(Icon)`
  margin-right: 10px;
`;

interface InfoPieceProps {
  title: string;
  value: string | number | JSX.Element;
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

interface ISocialNetwork {
  [index: string]: { name: string; icon: string };
}

const supportedSocialNetworks: ISocialNetwork = {
  telegram: {
    name: 'telegram',
    icon: socialTelegram
  },
  twitter: {
    name: 'twitter',
    icon: socialTwitter
  },
  reddit: {
    name: 'reddit',
    icon: socialReddit
  },
  github: {
    name: 'github',
    icon: socialGithub
  },
  facebook: {
    name: 'facebook',
    icon: socialFacebook
  },
  slack: {
    name: 'slack',
    icon: socialSlack
  },
  cmc: {
    name: 'coin market cap',
    icon: socialCmc
  }
};

export function TokenDetails() {
  // TODO: Fetch real token details
  const details = {
    symbol: 'NRM',
    name: 'Neuromachine Eternal',
    type: 'ERC20',
    address: '0x000000085824F23a070c2474442ED014c0e46B58',
    ens_address: '',
    decimals: 18,
    website: 'https://nrm.world',
    whitepaper: '',
    logo: {
      src: '',
      width: '',
      height: '',
      ipfs_hash: ''
    },
    support: {
      email: 'info@nrm.world',
      url: ''
    },
    social: {
      blog: '',
      chat: '',
      facebook: 'https://www.facebook.com/Neuromachine/',
      forum: 'https://bitcointalk.org/index.php?topic=3300257',
      github: 'https://github.com/NRM-Neuromachine',
      gitter: '',
      instagram: '',
      linkedin: 'https://www.linkedin.com/company/neuromachine/',
      reddit: '',
      slack: '',
      telegram: 'https://t.me/nrm_world',
      twitter: 'https://twitter.com/nrm_cash',
      youtube: ''
    }
  };

  interface ISocial {
    [index: string]: string;
  }

  // Find avaialble supported social links
  const filteredSocial = details.social as ISocial;
  Object.keys(filteredSocial).forEach(
    key =>
      (!filteredSocial[key] || !supportedSocialNetworks.hasOwnProperty(key)) &&
      delete filteredSocial[key]
  );
  const filteredSocialArray = Object.keys(filteredSocial);

  return (
    <div>
      <Section noMargin={true}>
        <TwoColumnsWrapper>
          <InfoPiece title={translateRaw('LATEST_PRICE')} value="$3,037.95" />
          <InfoPiece title={translateRaw('BALANCE')} value="393.239 OMG" />
        </TwoColumnsWrapper>
      </Section>
      <Section>
        <InfoPiece title={translateRaw('TOKEN_ADDRESS')} value={details.address} />
      </Section>
      <Section>
        <InfoPiece title={translateRaw('TOKEN_DECIMALS')} value={details.decimals} />
      </Section>
      <Section>
        <InfoPiece title={translateRaw('TOKEN_SYMBOL')} value={details.symbol} />
      </Section>
      <Section>
        <InfoPiece
          title={translateRaw('RESOURCES')}
          value={
            (details.website || details.whitepaper) && (
              <Resources>
                {details.website && (
                  <a href={details.website} target="_blank" rel="noreferrer">
                    <ResourceItem>
                      <ResourceIcon src={websiteIcon} />
                      {translateRaw('WEBSITE')}
                    </ResourceItem>
                  </a>
                )}
                {details.whitepaper && (
                  <a href={details.whitepaper} target="_blank" rel="noreferrer">
                    <ResourceItem>
                      <ResourceIcon src={whitepaperIcon} />
                      {translateRaw('WHITEPAPER')}
                    </ResourceItem>
                  </a>
                )}
              </Resources>
            )
          }
        />
      </Section>
      <Section>
        <InfoPiece
          title={translateRaw('SOCIAL')}
          value={
            <>
              {filteredSocialArray.map(social => {
                return <Icon key={social} src={supportedSocialNetworks[social].icon} />;
              })}
            </>
          }
        />
      </Section>
    </div>
  );
}
