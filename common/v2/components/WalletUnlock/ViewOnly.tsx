import React, { useState, useContext } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { ResolutionError } from '@unstoppabledomains/resolution';

import { translateRaw } from 'v2/translations';
import { WalletId, FormData, IReceiverAddress, ErrorObject } from 'v2/types';
import { Button, ContactLookupField } from 'v2/components';
import { WalletFactory } from 'v2/services/WalletService';
import { NetworkContext } from 'v2/services/Store';
import { isValidETHRecipientAddress } from 'v2/services/EthService/validators';
import { COLORS } from 'v2/theme';

const FormWrapper = styled(Form)`
  padding: 2em 0;
`;

const ButtonWrapper = styled(Button)`
  margin-top: 4em;
`;

interface Props {
  formData: FormData;
  onUnlock(param: any): void;
}

const WalletService = WalletFactory(WalletId.VIEW_ONLY);

export function ViewOnlyDecrypt({ formData, onUnlock }: Props) {
  const initialFormikValues: { address: IReceiverAddress } = {
    address: {
      display: '',
      value: ''
    }
  };
  const { getNetworkByName } = useContext(NetworkContext);
  const [isResolvingDomain, setIsResolvingDomain] = useState(false);
  const [network] = useState(getNetworkByName(formData.network));
  const [resolutionError, setResolutionError] = useState<ResolutionError>();

  const ViewOnlyFormSchema = Yup.object().shape({
    address: Yup.object()
      // @ts-ignore Hack as Formik doesn't officially support warnings
      // tslint:disable-next-line
      .test('is-valid', translateRaw('CHECKSUM_ERROR'), function(value) {
        const validationResult = isValidETHRecipientAddress(value.value, resolutionError);
        if (!validationResult.success) {
          return {
            name: validationResult.name,
            type: validationResult.type,
            message: validationResult.message
          };
        }
        return true;
      })
  });

  return (
    <div className="Panel">
      <div className="Panel-title">{translateRaw('INPUT_PUBLIC_ADDRESS_LABEL')}</div>
      <Formik
        initialValues={initialFormikValues}
        validationSchema={ViewOnlyFormSchema}
        onSubmit={fields => {
          onUnlock(WalletService.init(fields.address.value));
        }}
        render={({ errors, touched, values }) => {
          const isValid = Object.values(errors).filter(Boolean).length === 0;

          return (
            <FormWrapper>
              <Field
                name="address"
                value={values.address}
                component={(fieldProps: FieldProps) => (
                  <ContactLookupField
                    error={
                      errors && touched.address && errors.address && (errors.address as ErrorObject)
                    }
                    fieldProps={fieldProps}
                    network={network!}
                    resolutionError={resolutionError}
                    isValidAddress={isValid}
                    isResolvingName={isResolvingDomain}
                    onBlur={() => ({})}
                    setIsResolvingDomain={setIsResolvingDomain}
                    setResolutionError={setResolutionError}
                    clearErrors={() => setResolutionError(undefined)}
                  />
                )}
              />
              <ButtonWrapper
                type="submit"
                disabled={isResolvingDomain || !isValid}
                color={COLORS.WHITE}
                fullwidth={true}
              >
                {translateRaw('ACTION_6')}
              </ButtonWrapper>
            </FormWrapper>
          );
        }}
      />
    </div>
  );
}
