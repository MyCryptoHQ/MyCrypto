import React, { useState } from 'react';

import { Form, Formik } from 'formik';
import equals from 'ramda/src/equals';
import styled from 'styled-components';

import { Button, ContactLookupField } from '@components';
import { useNetworks } from '@services/Store';
import { WalletFactory } from '@services/WalletService';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';
import { ErrorObject, FormData, IReceiverAddress, WalletId } from '@types';
import { isFormValid, toChecksumAddressByChainId } from '@utils';

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

interface FormValues {
  address: IReceiverAddress;
}

const initialFormikValues: FormValues = {
  address: {
    display: '',
    value: ''
  }
};

export function ViewOnlyDecrypt({ formData, onUnlock }: Props) {
  const { getNetworkById } = useNetworks();
  const [isResolvingDomain, setIsResolvingDomain] = useState(false);
  const [network] = useState(getNetworkById(formData.network));

  const onSubmit = (fields: FormValues) => {
    if (equals(fields, initialFormikValues)) return;
    onUnlock(WalletService.init(toChecksumAddressByChainId(fields.address.value, network.chainId)));
  };

  return (
    <div className="Panel">
      <div className="Panel-title">{translateRaw('INPUT_PUBLIC_ADDRESS_LABEL')}</div>
      <Formik initialValues={initialFormikValues} onSubmit={onSubmit}>
        {({ errors, touched, values, setFieldError, setFieldTouched, setFieldValue }) => (
          <FormWrapper>
            <ContactLookupField
              name="address"
              value={values.address}
              error={errors && touched.address && errors.address && (errors.address as ErrorObject)}
              network={network}
              isResolvingName={isResolvingDomain}
              setIsResolvingDomain={setIsResolvingDomain}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              setFieldError={setFieldError}
            />
            <ButtonWrapper
              type="submit"
              disabled={isResolvingDomain || !isFormValid(errors)}
              color={COLORS.WHITE}
              fullwidth={true}
              onClick={() => onSubmit(values)}
            >
              {translateRaw('ACTION_6')}
            </ButtonWrapper>
          </FormWrapper>
        )}
      </Formik>
    </div>
  );
}
