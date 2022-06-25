import { useState } from 'react';

import { Form, Formik } from 'formik';
import equals from 'ramda/src/equals';
import styled from 'styled-components';

import { Body, Box, Button, ContactLookupField, Heading } from '@components';
import { useNetworks } from '@services/Store';
import { WalletFactory } from '@services/WalletService';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';
import { ErrorObject, FormData, IReceiverAddress, TAddress, WalletId } from '@types';
import { isFormValid, toChecksumAddressByChainId } from '@utils';

const FormWrapper = styled(Form)`
  padding-top: 2em;
`;

const ButtonWrapper = styled(Button)`
  margin-top: 4em;
`;

interface Props {
  formData: FormData;

  onUnlock(param: any): void;
}

const WalletService = WalletFactory[WalletId.OFFLINE];

interface FormValues {
  address: IReceiverAddress;
}

const initialFormikValues: FormValues = {
  address: {
    display: '',
    value: ''
  }
};

export function OfflineDecrypt({ formData, onUnlock }: Props) {
  const { getNetworkById } = useNetworks();
  const [isResolvingDomain, setIsResolvingDomain] = useState(false);
  const [network] = useState(getNetworkById(formData.network));

  const onSubmit = (fields: FormValues) => {
    if (equals(fields, initialFormikValues)) return;
    onUnlock(
      WalletService.init({
        address: toChecksumAddressByChainId(fields.address.value, network.chainId) as TAddress
      })
    );
  };

  return (
    <Box>
      <Heading fontSize="32px" textAlign="center" fontWeight="bold" mt="0">
        {translateRaw('INPUT_OFFLINE_ADDRESS_LABEL')}
      </Heading>
      <Body textAlign="center" fontSize="18px" paddingTop="16px">
        {translateRaw('OFFLINE_DISCLAIMER')}
      </Body>
      <Formik initialValues={initialFormikValues} onSubmit={onSubmit}>
        {({ errors, touched, values, setFieldError, setFieldTouched, setFieldValue }) => {
          const handleSubmit = () => onSubmit(values);

          return (
            <FormWrapper>
              <ContactLookupField
                name="address"
                data-testid="address-field"
                value={values.address}
                error={
                  errors && touched.address && errors.address && (errors.address as ErrorObject)
                }
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
                onClick={handleSubmit}
              >
                {translateRaw('ACTION_6')}
              </ButtonWrapper>
            </FormWrapper>
          );
        }}
      </Formik>
    </Box>
  );
}
