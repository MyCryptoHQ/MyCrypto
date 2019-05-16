import React from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import styled from 'styled-components';
import { Button, Input } from '@mycrypto/ui';

import { ExtendedContentPanel } from 'v2/components';
import { PanelProps } from '../../CreateWallet';
import translate, { translateRaw } from 'translations';

const initialValues = {
  password: '',
  confirmPassword: ''
};

const DescriptionItem = styled.div`
  margin-top: 18px;
  font-weight: normal;
  font-size: 18px;

  strong {
    font-weight: 900;
  }
`;

const PasswordForm = styled(Form)`
  margin-top: 22px;
`;

const FormItem = styled.fieldset`
  margin-top: 15px;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 30px;
  font-size: 18px;
`;

const Description = () => {
  return (
    <React.Fragment>
      <DescriptionItem>{translate('NEW_WALLET_KEYSTORE_DESCRIPTION_1')}</DescriptionItem>
      <DescriptionItem>{translate('NEW_WALLET_KEYSTORE_DESCRIPTION_2')}</DescriptionItem>
    </React.Fragment>
  );
};

interface Props extends PanelProps {
  generateWalletAndContinue?(password: string): void;
}

export default function GenerateKeystoreFilePanel({ onBack, generateWalletAndContinue }: Props) {
  return (
    <ExtendedContentPanel
      onBack={onBack}
      stepper={{
        current: 1,
        total: 5
      }}
      heading={translateRaw('NEW_WALLET_KEYSTORE_TITLE')}
      description={<Description />}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={values => generateWalletAndContinue && generateWalletAndContinue(values.password)}
        render={() => (
          <PasswordForm>
            <FormItem>
              <label htmlFor="password">{translate('INPUT_PASSWORD_LABEL')}</label>
              <Field
                name="password"
                render={({ field, form }: FieldProps<typeof initialValues>) => (
                  <Input
                    {...field}
                    onChange={({ target: { value } }) => form.setFieldValue(field.name, value)}
                    icon="showNetworks"
                    iconSide="right"
                  />
                )}
              />
            </FormItem>
            <FormItem>
              <label htmlFor="confirmPassword">{translate('INPUT_CONFIRM_PASSWORD_LABEL')}</label>
              <Field
                name="confirmPassword"
                render={({ field, form }: FieldProps<typeof initialValues>) => (
                  <Input
                    {...field}
                    onChange={({ target: { value } }) => form.setFieldValue(field.name, value)}
                    icon="showNetworks"
                    iconSide="right"
                  />
                )}
              />
            </FormItem>
            <DescriptionItem>{translate('NEW_WALLET_KEYSTORE_DESCRIPTION_3')}</DescriptionItem>
            <SubmitButton type="submit">{translate('NEW_WALLET_KEYSTORE_BUTTON')}</SubmitButton>
          </PasswordForm>
        )}
      />
    </ExtendedContentPanel>
  );
}
