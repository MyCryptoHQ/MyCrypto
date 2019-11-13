import React, { useState, useContext } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { translateRaw } from 'v2/translations';
import { WalletId, FormData } from 'v2/types';
import { AddressField, Button } from 'v2/components';
import { WalletFactory } from 'v2/services/WalletService';
import { getResolvedENSAddress } from 'v2/services/EthService';
import { NetworkContext } from 'v2/services/Store';

import './ViewOnly.scss';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  formData: FormData;
  currentAddress: string; //ICurrentTo;
  resolvedAddress: string; //getResolvedAddress;
}

type Props = OwnProps & StateProps;

export interface IViewOnlyFormikValues {
  addressObject: {
    display: string;
    value: string;
  };
}

const WalletService = WalletFactory(WalletId.VIEW_ONLY);

const ViewOnlyFormSchema = Yup.object().shape({
  addressObject: Yup.object({
    value: Yup.string()
      .max(42, translateRaw('TO_FIELD_ERROR'))
      .min(42, translateRaw('TO_FIELD_ERROR'))
  }).required(translateRaw('REQUIRED'))
});

export function ViewOnlyDecrypt({ formData, onUnlock }: Props) {
  const initialFormikValues: IViewOnlyFormikValues = {
    addressObject: {
      display: '',
      value: ''
    }
  };
  const { getNetworkByName } = useContext(NetworkContext);
  const [isResolvingENSName, setIsResolvingENSName] = useState(false);
  const [network] = useState(getNetworkByName(formData.network));
  return (
    <div className="ViewOnly">
      <div className="ViewOnly-title"> {translateRaw('INPUT_PUBLIC_ADDRESS_LABEL')}</div>
      <Formik
        initialValues={initialFormikValues}
        validationSchema={ViewOnlyFormSchema}
        onSubmit={fields => {
          onUnlock(fields);
        }}
        render={({ errors, setFieldValue, touched, values }) => {
          const handleSubmit = (e: React.SyntheticEvent<HTMLElement>) => {
            const wallet = values.addressObject.value;

            if (wallet) {
              e.preventDefault();
              e.stopPropagation();
              onUnlock(WalletService.init(wallet));
            }
          };

          const handleENSResolve = async (name: string) => {
            if (!values || !network) {
              setIsResolvingENSName(false);
              return;
            }
            setIsResolvingENSName(true);
            const resolvedAddress =
              (await getResolvedENSAddress(network, name)) ||
              '0x0000000000000000000000000000000000000000';
            setIsResolvingENSName(false);
            setFieldValue('addressObject', { ...values.addressObject, value: resolvedAddress });
            setIsResolvingENSName(false);
          };
          return (
            <Form>
              <section className="ViewOnly-fields">
                <section className="ViewOnly-fields-field">
                  <AddressField
                    fieldName="addressObject"
                    handleENSResolve={handleENSResolve}
                    error={errors && errors.addressObject && errors.addressObject.value}
                    touched={touched}
                    network={network}
                    isLoading={isResolvingENSName}
                    placeholder="Enter an Address or Contact"
                  />
                </section>
              </section>
              <section className="ViewOnly-fields-field">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isResolvingENSName}
                  className="ViewOnly-submit"
                >
                  Next{/* TRANSLATE THIS */}
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
