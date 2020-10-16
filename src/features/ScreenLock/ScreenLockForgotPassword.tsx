import React, { FC, useContext } from 'react';

import { Button } from '@mycrypto/ui';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import mainImage from '@assets/images/icn-forgot-password.svg';
import { ExtendedContentPanel } from '@components';
import { ROUTE_PATHS } from '@config';
import translate, { translateRaw } from '@translations';
import { goBack } from '@utils';

import { ScreenLockContext } from './ScreenLockProvider';

const ActionButton = styled(Button)`
  width: 320px;
  margin-top: 10px;
  font-size: 18px;
  padding-left: 5px;
  padding-right: 5px;

  @media (min-width: 700px) {
    width: 420px;
  }
`;

const FormWrapper = styled.div`
  margin: 14px 0;
`;

const Description = styled.p`
  text-align: left;
  font-size: 18px;
  font-weight: normal;
  margin-top: 28px;
  line-height: 1.5;
  padding: 0 30px;
  color: ${(props) => props.theme.text};

  @media (max-width: 700px) {
    padding: 0 8px;
  }
`;

const ScreenLockForgotPassword: FC<RouteComponentProps> = ({ history }) => {
  const { resetAll } = useContext(ScreenLockContext);
  const onBack = () => goBack(history);

  return (
    <ExtendedContentPanel
      onBack={onBack}
      heading={translateRaw('SCREEN_LOCK_FORGOT_PASSWORD_HEADING')}
      description={
        <Description>{translateRaw('SCREEN_LOCK_FORGOT_PASSWORD_DESCRIPTION')}</Description>
      }
      image={mainImage}
      showImageOnTop={true}
      centered={true}
      className=""
    >
      <Description>
        <p>{translate('SCREEN_LOCK_FORGOT_PASSWORD_LIST_ITEM1')}</p>
        <p>{translate('SCREEN_LOCK_FORGOT_PASSWORD_LIST_ITEM2')}</p>
      </Description>
      <FormWrapper>
        <ActionButton
          onClick={() => {
            history.push(ROUTE_PATHS.SETTINGS_IMPORT.path);
          }}
        >
          {translate('SCREEN_LOCK_FORGOT_PASSWORD_ADDITIONAL_IMPORT')}
        </ActionButton>
        <ActionButton
          onClick={() => {
            resetAll();
          }}
        >
          {translate('SCREEN_LOCK_FORGOT_PASSWORD_ADDITIONAL_START_OVER')}
        </ActionButton>
      </FormWrapper>
    </ExtendedContentPanel>
  );
};

export default withRouter(ScreenLockForgotPassword);
