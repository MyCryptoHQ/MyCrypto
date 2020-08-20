import React, { useState, useContext } from 'react';
import { Formik, Form } from 'formik';
import styled from 'styled-components';
import equals from 'ramda/src/equals';

import { translateRaw } from '@translations';
import { WalletId, FormData, IReceiverAddress, ErrorObject } from '@types';
import { Button, ContactLookupField } from '@components';
import { WalletFactory } from '@services/WalletService';
import { NetworkContext } from '@services/Store';
import { COLORS } from '@theme';
import { toChecksumAddressByChainId, isFormValid } from '@utils';

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
  const { getNetworkById } = useContext(NetworkContext);
  const [isResolvingDomain, setIsResolvingDomain] = useState(false);
  const [network] = useState(getNetworkById(formData.network));

  const onSubmit = (fields: FormValues) => {
    if (equals(fields, initialFormikValues)) return;
    onUnlock(WalletService.init(toChecksumAddressByChainId(fields.address.value, network.chainId)));
  };

  return (
    <div className="Panel">
      <div className="Panel-title">{translateRaw('INPUT_PUBLIC_ADDRESS_LABEL')}</div>
      <Formik
        initialValues={initialFormikValues}
        onSubmit={onSubmit}
        render={({ errors, touched, values, setFieldError, setFieldTouched, setFieldValue }) => (
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
      />
    </div>
  );
}
