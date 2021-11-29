import { useState } from 'react';

import { IWallet } from '@mycrypto/wallet-list';
import { Form, Formik } from 'formik';
import equals from 'ramda/src/equals';
import styled from 'styled-components';

import { Body, Box, Button, ContactLookupField, Heading, WalletIcon, WalletTag } from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { useNetworks } from '@services/Store';
import { WalletFactory } from '@services/WalletService';
import { COLORS } from '@theme';
import translate, { translateRaw } from '@translations';
import { ErrorObject, FormData, IReceiverAddress, TAddress, WalletId } from '@types';
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
  walletInfos?: IWallet;
}

const WalletService = WalletFactory[WalletId.VIEW_ONLY];

interface FormValues {
  address: IReceiverAddress;
}

const initialFormikValues: FormValues = {
  address: {
    display: '',
    value: ''
  }
};

export function ViewOnlyDecrypt({ formData, onUnlock, walletInfos }: Props) {
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
    <Box p="2.5em">
      {walletInfos && (
        <Box display="flex" variant="columnCenter">
          <WalletIcon wallet={walletInfos} />
          <Box variant="rowCenter">
            {walletInfos.tags && walletInfos.tags.map((tag, i) => <WalletTag tag={tag} key={i} />)}
          </Box>
        </Box>
      )}
      <Heading fontSize="32px" textAlign="center" fontWeight="bold">
        {walletInfos
          ? translateRaw('VIEW_ONLY_HEADING', { $wallet: walletInfos.name })
          : translateRaw('INPUT_PUBLIC_ADDRESS_LABEL')}
      </Heading>
      <Body textAlign="center" fontSize="18px" paddingTop="16px">
        {walletInfos
          ? translateRaw('VIEW_ONLY_SUBHEADING')
          : translate('VIEW_ONLY_ADDR_DISCLAIMER', {
              $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_DOES_VIEW_ADDRESS_WORK)
            })}
      </Body>
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
              placeholder={
                walletInfos && translateRaw('VIEW_ONLY_PLACEHOLDER', { $wallet: walletInfos.name })
              }
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
    </Box>
  );
}
