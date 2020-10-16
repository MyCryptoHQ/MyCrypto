import React, { FC, useCallback, useState } from 'react';

import { Button } from '@mycrypto/ui';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import mainImage from '@assets/images/icn-create-pw.svg';
import { ExtendedContentPanel, InputField } from '@components';
import translate, { translateRaw } from '@translations';
import { goBack } from '@utils';

import { ScreenLockContext } from './ScreenLockProvider';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 4px 26px 4px;
`;

const ActionButton = styled(Button)`
  width: 320px;
  margin-top: 10px;
  font-size: 18px;

  @media (min-width: 700px) {
    width: 420px;
  }
`;

const FormWrapper = styled.form`
  margin-top: 15px;
  max-width: 420px;
`;

const BottomActions = styled.div`
  margin-top: 30px;
  line-height: 2.5;
`;

const ScreenLockNew: FC<RouteComponentProps> = ({ history }) => {
  const [state, setState] = useState({
    password1: '',
    password2: '',
    password1Error: '',
    password2Error: ''
  });

  const validateForm = useCallback(() => {
    setState((prevState) => ({ ...prevState, password1Error: '', password2Error: '' }));
    const { password1, password2 } = state;
    const minLength = 8;

    if (password1.length > 0 && password1.length < minLength) {
      setState((prevState) => ({
        ...prevState,
        password1Error: translateRaw('INPUT_ERROR_PASSWORD_TOO_SHORT')
      }));
    }

    if (password1 !== password2 && password2.length > 0) {
      setState((prevState) => ({
        ...prevState,
        password2Error: translateRaw('INPUT_ERROR_PASSWORDS_DONT_MATCH')
      }));
    }
  }, [state, setState]);

  const onPassword1Changed = useCallback(
    (event) => {
      const { value } = event.target;
      setState((prevState) => ({
        ...prevState,
        password1: value
      }));
    },
    [setState]
  );

  const onPassword2Changed = useCallback(
    (event) => {
      const { value } = event.target;
      setState((prevState) => ({
        ...prevState,
        password2: value
      }));
    },
    [setState]
  );

  const handleCreatePasswordClicked = useCallback(
    (encryptWithPassword: (password: string, hashed: boolean) => void) => (e: any) => {
      e.preventDefault();

      const { password1, password2, password1Error, password2Error } = state;
      if (
        !(password1Error || password2Error) &&
        !(password1.length === 0 || password2.length === 0) &&
        password1 === password2
      ) {
        encryptWithPassword(password1, false);
      }
    },
    [state, setState]
  );

  const onBack = useCallback(() => {
    goBack(history);
  }, [history]);

  return (
    <ScreenLockContext.Consumer>
      {({ encryptWithPassword }) => (
        <ExtendedContentPanel
          onBack={onBack}
          heading={translateRaw('SCREEN_LOCK_NEW_HEADING')}
          description={translateRaw('SCREEN_LOCK_NEW_DESCRIPTION')}
          image={mainImage}
          showImageOnTop={true}
          centered={true}
          className=""
        >
          <ContentWrapper>
            <FormWrapper onSubmit={handleCreatePasswordClicked(encryptWithPassword)}>
              <InputField
                label={translateRaw('SCREEN_LOCK_NEW_PASSWORD_LABEL')}
                value={state.password1}
                onChange={onPassword1Changed}
                validate={validateForm}
                inputError={state.password1Error}
                type={'password'}
              />
              <InputField
                label={translateRaw('SCREEN_LOCK_NEW_CONFIRM_PASSWORD_LABEL')}
                value={state.password2}
                onChange={onPassword2Changed}
                validate={validateForm}
                inputError={state.password2Error}
                type={'password'}
              />
              <ActionButton type="submit">
                {translate('SCREEN_LOCK_NEW_CREATE_PASSWORD_BUTTON')}
              </ActionButton>
            </FormWrapper>
            <BottomActions>
              <div>
                {translate('SCREEN_LOCK_LOCKED_RECOMMEND_LOCK')}{' '}
                <Link to="/dashboard">{translate('SCREEN_LOCK_LOCKED_LEARN_MORE')}</Link>
              </div>
            </BottomActions>
          </ContentWrapper>
        </ExtendedContentPanel>
      )}
    </ScreenLockContext.Consumer>
  );
};

export default withRouter(ScreenLockNew);
