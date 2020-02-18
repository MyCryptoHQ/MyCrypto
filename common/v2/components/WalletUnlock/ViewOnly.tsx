import React, { useState, useContext } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { translateRaw } from 'v2/translations';
import { WalletId, FormData, IReceiverAddress } from 'v2/types';
import { AddressField, Button } from 'v2/components';
import { WalletFactory } from 'v2/services/WalletService';
import { getResolvedENSAddress, isValidETHAddress, isValidENSName } from 'v2/services/EthService';
import { NetworkContext } from 'v2/services/Store';
import { CREATION_ADDRESS } from 'v2/config';

import './ViewOnly.scss';
import { COLORS } from 'v2/theme';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  formData: FormData;
  currentAddress: string; //ICurrentTo;
  resolvedAddress: string; //getResolvedAddress;
}

type Props = OwnProps & StateProps;

const WalletService = WalletFactory(WalletId.VIEW_ONLY);

const ViewOnlyFormSchema = Yup.object().shape({
  address: Yup.object({
    value: Yup.string().test(
      'check-eth-address',
      translateRaw('TO_FIELD_ERROR'),
      value => isValidETHAddress(value) || isValidENSName(value)
    )
  }).required(translateRaw('REQUIRED'))
});

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
  return (
    <div className="Panel">
      <div className="Panel-title"> {translateRaw('INPUT_PUBLIC_ADDRESS_LABEL')}</div>
      <Formik
        initialValues={initialFormikValues}
        validationSchema={ViewOnlyFormSchema}
        onSubmit={fields => {
          onUnlock(fields);
        }}
        render={({ errors, setFieldValue, setFieldError, touched, values }) => {
          const isValid =
            Object.values(errors).filter(error => error !== undefined && error.value !== undefined)
              .length === 0;

          const handleSubmit = (e: React.SyntheticEvent<HTMLElement>) => {
            const wallet = values.address.value;

            if (wallet && isValid) {
              e.preventDefault();
              e.stopPropagation();
              onUnlock(WalletService.init(wallet));
            }
          };

          const handleDomainResolve = async (name: string) => {
            if (!values || !network) {
              setIsResolvingDomain(false);
              return;
            }
            setIsResolvingDomain(true);
            const resolvedAddress =
              (await getResolvedENSAddress(network, name)) || CREATION_ADDRESS;
            setIsResolvingDomain(false);
            if (isValidETHAddress(resolvedAddress)) {
              setFieldValue('address', { ...values.address, value: resolvedAddress });
            } else {
              setFieldError('address', translateRaw('TO_FIELD_ERROR'));
            }
            setIsResolvingDomain(false);
          };
          return (
            <Form>
              <section className="ViewOnly-fields">
                <section className="ViewOnly-fields-field">
                  <AddressField
                    className="AddressField"
                    fieldName="address"
                    handleDomainResolve={handleDomainResolve}
                    error={errors && touched.address && errors.address && errors.address.value}
                    isLoading={isResolvingDomain}
                    isError={!isValid}
                    placeholder="Enter an Address or Contact"
                  />
                </section>
              </section>
              <section className="ViewOnly-fields-field">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isResolvingDomain}
                  className="ViewOnly-submit"
                  color={COLORS.WHITE}
                >
                  {translateRaw('ACTION_6')}
                </Button>
              </section>
            </Form>
          );
        }}
      />
    </div>
  );

  // private handleSelectAddressFromBook = (ev: React.FormEvent<HTMLInputElement>) => {
  //   const {
  //     currentTarget: { value: addressFromBook }
  //   } = ev;
  //   this.setState({ addressFromBook });
  // };
}
