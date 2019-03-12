import React from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Button, Input, Typography } from '@mycrypto/ui';

import { ContentPanel } from 'v2/components';
import { PanelProps } from '../../CreateWallet';
import './GenerateKeystoreFilePanel.scss';

const initialValues = {
  password: '',
  confirmPassword: ''
};

export default function GenerateKeystoreFilePanel({ onBack, onNext }: PanelProps) {
  return (
    <ContentPanel
      onBack={onBack}
      stepper={{
        current: 2,
        total: 3
      }}
      heading="Generate a Keystore File"
      className="GenerateKeystoreFilePanel"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={console.info}
        render={() => (
          <Form>
            <fieldset className="GenerateKeystoreFilePanel-fieldset">
              <label htmlFor="password" className="GenerateKeystoreFilePanel-fieldset-label">
                Password
              </label>
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
            </fieldset>
            <fieldset className="GenerateKeystoreFilePanel-fieldset">
              <label htmlFor="confirmPassword" className="GenerateKeystoreFilePanel-fieldset-label">
                Confirm Password
              </label>
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
            </fieldset>
            <Typography>
              This password encrypts your private key. This does not act as a seed to generate your
              keys.
            </Typography>
            <Typography>
              <strong>
                You will need this password + your keystore file to unlock your wallet.
              </strong>
            </Typography>
            <Button onClick={onNext} className="GenerateKeystoreFilePanel-button">
              Create Keystore File
            </Button>
            <Typography className="GenerateKeystoreFilePanel-bottom">
              Don’t know what a keystore file is? <a href="">Learn more.</a>
            </Typography>
          </Form>
        )}
      />
    </ContentPanel>
  );
}
