import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { Icon, LinkApp } from '@components';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import { isUrl } from '@utils';

import { Action } from '../types';

const SContainer = styled('div')`
  align-items: center;
  background: ${COLORS.WHITE};
  border-radius: 5px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  display: flex;
  justify-content: center;
  margin-bottom: ${SPACING.BASE};
  padding: ${SPACING.BASE};

  @media (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    height: 155px;
  }

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 30%;
    align-self: stretch;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }

  transition: 200ms ease all;
  opacity: 1;
  &:hover {
    transition: 200ms ease all;
    transform: scale(1.02);
    opacity: 0.7;
  }
`;

const SButton = styled(Button)<{ faded?: boolean }>`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  text-align: center;
  word-wrap: word-break;
  & > img {
    height: 50px;
    display: block;
  }
  & > svg {
    height: 50px;
    display: block;
    fill: none !important;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
    & > svg {
      opacity: ${(props) => (props.faded ? '.8' : 'inherit')};
      height: 54px;
      order: 1;
    }
    & > img {
      opacity: ${(props) => (props.faded ? '.8' : 'inherit')};
      height: 54px;
      order: 1;
    }
  }
`;

const STitle = styled('div')`
  margin: 0;
  font-weight: bold;
  color: ${COLORS.BLUE_DARK_SLATE};
  line-height: 1.4;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    font-size: ${FONT_SIZE.SM};
    padding-top: ${SPACING.XS};
    /* The link for 'Get Hardware Wallet' is too long to use a line per word. */
    word-spacing: ${({ isLonger }: { isLonger: boolean }) => (isLonger ? 'inherit' : '9999px')};
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    font-size: ${FONT_SIZE.BASE};
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_LG}) {
    font-size: ${FONT_SIZE.XL};
  }
`;

const SDescription = styled('div')`
  display: none;
  font-size: ${FONT_SIZE.BASE};
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: block;
  }
`;

function ActionTile({ icon, faded, title, description, link }: Action) {
  return (
    <SContainer>
      <LinkApp href={link} isExternal={isUrl(link)}>
        <SButton basic={true} faded={faded}>
          <Icon type={icon} alt={title} />
          <Typography as="div">
            <STitle isLonger={title.length > 15}>{title}</STitle>
            <SDescription>{description}</SDescription>
          </Typography>
        </SButton>
      </LinkApp>
    </SContainer>
  );
}

export default ActionTile;
