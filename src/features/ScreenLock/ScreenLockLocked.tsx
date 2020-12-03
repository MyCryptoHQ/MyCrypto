import React, { FC, useCallback, useState } from 'react';

import { Button } from '@mycrypto/ui';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import mainImage from '@assets/images/icn-unlock-wallet.svg';
import { ExtendedContentPanel, InputField } from '@components';
import { useAnalytics } from '@hooks';
import { ANALYTICS_CATEGORIES } from '@services';
import translate, { translateRaw } from '@translations';

import { ScreenLockContext } from './ScreenLockProvider';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 4px 26px 4px;
`;

const PrimaryButton = styled(Button)`
  width: 320px;
  margin-top: 10px;
  font-size: 18px;

  @media (min-width: 700px) {
    width: 420px;
  }
`;

const FormWrapper = styled.form`
  margin-top: 15px;
  max-width: 320px;

  @media (min-width: 700px) {
    max-width: 420px;
  }
`;

const BottomActions = styled.div`
  margin-top: 35px;
  line-height: 2.5;
`;

const ScreenLockLocked: FC<RouteComponentProps> = () => {
  const [state, setState] = useState<{
    password: string;
    passwordError: string;
  }>({
    password: '',
    passwordError: ''
  });
  const trackScreenLock = useAnalytics({
    category: ANALYTICS_CATEGORIES.SCREEN_LOCK,
    actionName: 'Why do we recommend link clicked'
  });

  const onPasswordChanged = useCallback(
    (event) => {
      setState({ password: event.target.value, passwordError: '' });
    },
    [setState]
  );

  const handleUnlockWalletClick = useCallback(
    async (decryptWithPassword: any, e: any) => {
      e.preventDefault();
      const response = await decryptWithPassword(state.password);
      if (response === false) {
        setState((prevState) => ({
          ...prevState,
          passwordError: translateRaw('SCREEN_LOCK_LOCKED_WRONG_PASSWORD')
        }));
      }
    },
    [state, setState]
  );

  return (
    <ScreenLockContext.Consumer>
      {({ decryptWithPassword }) => (
        <ExtendedContentPanel
          heading={translateRaw('SCREEN_LOCK_LOCKED_HEADING')}
          description={translateRaw('SCREEN_LOCK_LOCKED_DESCRIPTION')}
          image={mainImage}
          showImageOnTop={true}
          centered={true}
          className=""
        >
          <ContentWrapper>
            <FormWrapper onSubmit={(e) => handleUnlockWalletClick(decryptWithPassword, e)}>
              <InputField
                label={translateRaw('SCREEN_LOCK_LOCKED_PASSWORD_LABEL')}
                value={state.password}
                onChange={onPasswordChanged}
                inputError={state.passwordError}
                type={'password'}
              />
              <PrimaryButton type="submit">{translate('SCREEN_LOCK_LOCKED_UNLOCK')}</PrimaryButton>
            </FormWrapper>
            <BottomActions>
              <div>
                {translate('SCREEN_LOCK_LOCKED_FORGOT_PASSWORD')}{' '}
                <Link to="/screen-lock/forgot-password">
                  {translate('SCREEN_LOCK_LOCKED_IMPORT_SETTINGS')}
                </Link>
              </div>
              <div>
                {translate('SCREEN_LOCK_LOCKED_RECOMMEND_LOCK')}{' '}
                <Link onClick={() => trackScreenLock()} to="/dashboard">
                  {translate('SCREEN_LOCK_LOCKED_LEARN_MORE')}
                </Link>
              </div>
            </BottomActions>
          </ContentWrapper>
        </ExtendedContentPanel>
      )}
    </ScreenLockContext.Consumer>
  );
};

export default withRouter(ScreenLockLocked);
