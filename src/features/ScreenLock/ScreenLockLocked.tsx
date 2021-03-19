import React, { useContext, useEffect, useState } from 'react';

import { Button } from '@mycrypto/ui';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import mainImage from '@assets/images/icn-unlock-wallet.svg';
import { Body, ExtendedContentPanel, InputField, LinkApp } from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE, ROUTE_PATHS } from '@config';
import { AppState, getDecryptionError } from '@store';
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

const ScreenLockLocked = ({ getDecryptionError: decryptErrorRedux }: Props) => {
  const { decryptWithPassword, decryptError: decryptErrorContext } = useContext(ScreenLockContext);
  const decryptError = decryptErrorContext || decryptErrorRedux;

  const [state, setState] = useState<{
    password: string;
    passwordError: string;
  }>({
    password: '',
    passwordError: ''
  });

  useEffect(() => {
    if (decryptError) {
      setState({ password: '', passwordError: translateRaw('SCREEN_LOCK_LOCKED_WRONG_PASSWORD') });
    }
  }, [decryptError]);

  const handleUnlockWalletClick = (e: React.FormEvent) => {
    e.preventDefault();
    decryptWithPassword(state.password);
  };

  return (
    <ExtendedContentPanel
      heading={translateRaw('SCREEN_LOCK_LOCKED_HEADING')}
      description={translateRaw('SCREEN_LOCK_LOCKED_DESCRIPTION')}
      image={mainImage}
      showImageOnTop={true}
      centered={true}
      className=""
    >
      <ContentWrapper>
        <FormWrapper onSubmit={handleUnlockWalletClick}>
          <InputField
            label={translateRaw('SCREEN_LOCK_LOCKED_PASSWORD_LABEL')}
            value={state.password}
            onChange={(e) => setState({ password: e.target.value, passwordError: '' })}
            inputError={state.passwordError}
            type={'password'}
          />
          <Body>
            The Screen Lock feature is being removed. You will not be able to lock MyCrypto again.{' '}
            <LinkApp href={getKBHelpArticle(KB_HELP_ARTICLE.WHAT_IS_SCREEN_LOCK)} isExternal={true}>
              Read More
            </LinkApp>
          </Body>
          <PrimaryButton type="submit">{translate('SCREEN_LOCK_LOCKED_UNLOCK')}</PrimaryButton>
        </FormWrapper>
        <BottomActions>
          <div>
            {translate('SCREEN_LOCK_LOCKED_FORGOT_PASSWORD')}{' '}
            <LinkApp href={ROUTE_PATHS.SCREEN_LOCK_FORGOT.path}>
              {translate('SCREEN_LOCK_LOCKED_IMPORT_SETTINGS')}
            </LinkApp>
          </div>
          <div>
            {translate('SCREEN_LOCK_LOCKED_RECOMMEND_LOCK')}{' '}
            <LinkApp href={getKBHelpArticle(KB_HELP_ARTICLE.WHAT_IS_SCREEN_LOCK)} isExternal={true}>
              {translate('SCREEN_LOCK_LOCKED_LEARN_MORE')}
            </LinkApp>
          </div>
        </BottomActions>
      </ContentWrapper>
    </ExtendedContentPanel>
  );
};

const mapStateToProps = (state: AppState) => ({
  getDecryptionError: getDecryptionError(state)
});

const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector>;

export default connector(ScreenLockLocked);
