import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import InlineSVG, { IProps as InlineSVGProps } from 'react-inlinesvg';

const icons = {
  back: require('@assets/icons/actions/back.svg'),
  expand: require('@assets/icons/actions/expand.svg'),

  'logo-mycrypto': require('@assets/icons/brand/logo.svg'),
  'logo-mycrypto-text': require('@assets/icons/brand/logo-text.svg'),

  coinmarketcap: require('@assets/icons/social/coinmarketcap.svg'),
  facebook: require('@assets/icons/social/facebook.svg'),
  github: require('@assets/icons/social/github.svg'),
  reddit: require('@assets/icons/social/reddit.svg'),
  slack: require('@assets/icons/social/slack.svg'),
  telegram: require('@assets/icons/social/telegram.svg'),
  twitter: require('@assets/icons/social/twitter.svg'),

  website: require('@assets/icons/website.svg'),
  whitepaper: require('@assets/icons/whitepaper.svg')
};

const StyledInlineSVG = styled(InlineSVG)`
  svg {
    color: ${(props) => props.color};
  }
`;

interface Props extends Omit<InlineSVGProps, 'src'> {
  type: keyof typeof icons;
  color?: string;
}

const Icon: FunctionComponent<Props> = ({ type, ...props }) => (
  <StyledInlineSVG src={icons[type]} {...props} />
);

export default Icon;
