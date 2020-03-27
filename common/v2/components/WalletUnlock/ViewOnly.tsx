import React, { useState, useContext } from 'react';
import { Formik, Form } from 'formik';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { WalletId, FormData, IReceiverAddress, ErrorObject } from 'v2/types';
import { Button, ContactLookupField } from 'v2/components';
import { WalletFactory } from 'v2/services/WalletService';
import { NetworkContext } from 'v2/services/Store';
import { COLORS } from 'v2/theme';
import { toChecksumAddressByChainId, isFormValid } from 'v2/utils';

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
  const { getNetworkByName } = useContext(NetworkContext);
  const [isResolvingDomain, setIsResolvingDomain] = useState(false);
  const [network] = useState(getNetworkByName(formData.network));

  const onSubmit = (fields: FormValues) =>
    onUnlock(
      WalletService.init(toChecksumAddressByChainId(fields.address.value, network!.chainId))
    );

  return (
    <div className="Panel">
      <div className="Panel-title">{translateRaw('INPUT_PUBLIC_ADDRESS_LABEL')}</div>
      <Formik
        initialValues={initialFormikValues}
        onSubmit={onSubmit}
        render={({ errors, touched, values }) => (
          <FormWrapper>
            <ContactLookupField
              name="address"
              value={values.address}
              error={errors && touched.address && errors.address && (errors.address as ErrorObject)}
              network={network!}
              isResolvingName={isResolvingDomain}
              setIsResolvingDomain={setIsResolvingDomain}
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
