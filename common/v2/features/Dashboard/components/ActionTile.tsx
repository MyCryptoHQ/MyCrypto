import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Typography } from '@mycrypto/ui';

import { isUrl } from 'v2/utils';
import { BREAK_POINTS } from 'v2/theme';
import { Action } from '../types';

const SContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;

  margin-bottom: 20px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  border-radius: 3px;
  background: #fff;
  padding: 8px;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 110px;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    width: 100%;
    padding-left: 40px;
    padding-right: 35px;
  }
`;

const SButton = styled(Button)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  word-wrap: word-break;
  & > img {
    width: 50px;
    display: block;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
    & > img {
      width: 54px;
      order: 1;
    }
`;

const STitle = styled('div')`
  margin: 0;
  font-weight: bold;
  color: #163150;

  @media (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    font-size: 14px;
    padding-top: 2px;

    // The link for 'Get Hardware Wallet' is too long to use a line per word.
    word-spacing: ${({ isLonger }: { isLonger: boolean }) => (isLonger ? 'inherit' : '9999px')};
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    padding-top: 0px;
    font-size: 16px;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_LG}) {
    padding-top: 0px;
    font-size: 24px;
  }
`;

const SDescription = styled('div')`
  display: none;
  font-size: 16px;
  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    display: block;
  }
`;

type Props = RouteComponentProps<{}> & Action;
function ActionTile({ icon, title, description, link, history }: Props) {
  const goToExternalLink = (url: string) => window.open(url, '_blank');
  const goToAppRouter = (path: string) => history.push(path);

  const action = isUrl(link) ? goToExternalLink : goToAppRouter;

  return (
    <SContainer className="ActionTile">
      <SButton basic={true} className="ActionTile-button" onClick={() => action(link)}>
        <img className="ActionTile-button-icon" src={icon} alt={title} />
        <Typography as="div">
          <STitle isLonger={title.length > 15}>{title}</STitle>
          <SDescription>{description}</SDescription>
        </Typography>
      </SButton>
    </SContainer>
  );
}

export default withRouter(ActionTile);
