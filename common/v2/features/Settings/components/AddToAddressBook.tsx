import React, { useContext } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import backArrowIcon from '@assets/images/icn-back-arrow.svg';
import { DashboardPanel, NetworkSelectDropdown, InputField } from '@components';
import { AddressBook, NetworkId } from '@types';
import { ToastContext } from '@features/Toasts';
import { translateRaw } from '@translations';
import { isValidETHAddress } from '@services/EthService';
import { AddressBookContext } from '@services';
import { DEFAULT_NETWORK } from '@config/constants';

const AddToAddressBookPanel = styled(DashboardPanel)`
  padding: 24px 30px;
`;

const BackButton = styled(Button)`
  margin-right: 16px;
`;

const AddressFieldset = styled.fieldset`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 9px;
    color: #163150;
  }
  input,
  textarea {
    display: block;
    width: 100%;
  }
`;

const AddressBookButtons = styled.div`
  button {
    &:first-of-type {
      margin-right: 12px;
    }
  }
`;

const SNetworkSelectDropdown = styled(NetworkSelectDropdown)`
  margin-bottom: 15px;
`;

interface Props {
  toggleFlipped(): void;
  createAddressBooks(values: AddressBook): void;
}

export default function AddToAddressBook({ toggleFlipped, createAddressBooks }: Props) {
  const { getContactByAddress } = useContext(AddressBookContext);

  const Schema = Yup.object().shape({
    label: Yup.string().required(translateRaw('REQUIRED')),
    address: Yup.string()
      .test('check-eth-address', translateRaw('TO_FIELD_ERROR'), (value) =>
        isValidETHAddress(value)
      )
      .test('doesnt-exist', translateRaw('ADDRESS_ALREADY_ADDED'), function (value) {
        const contact = getContactByAddress(value);
        if (contact !== undefined) {
          return this.createError({
            message: translateRaw('ADDRESS_ALREADY_ADDED', { $label: contact.label })
          });
        }
        return true;
      })
  });

  const { displayToast, toastTemplates } = useContext(ToastContext);

  return (
    <AddToAddressBookPanel
      heading={
        <>
          <BackButton basic={true} onClick={toggleFlipped}>
            <img src={backArrowIcon} alt="Back" />
          </BackButton>
          {translateRaw('ADDRESS_BOOK_TABLE_ADD_ADDRESS')}
        </>
      }
      padChildren={true}
    >
      <Formik
        validationSchema={Schema}
        initialValues={{
          label: '',
          address: '',
          notes: '',
          network: DEFAULT_NETWORK
        }}
        onSubmit={(values: AddressBook, { setSubmitting }) => {
          createAddressBooks(values);
          setSubmitting(false);
          displayToast(toastTemplates.addedAddress, { label: values.label });
          toggleFlipped();
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <AddressFieldset>
              <label htmlFor="label">{translateRaw('ACCOUNT_LIST_LABEL')}</label>
              <Field
                name="label"
                render={({ field }: FieldProps<string>) => (
                  <InputField
                    {...field}
                    placeholder={translateRaw('ADDRESS_BOOK_NAME_OF_ADDRESS_PLACEHOLDER')}
                  />
                )}
              />
            </AddressFieldset>
            <AddressFieldset>
              <label htmlFor="address">{translateRaw('ADDRESSBOOK_ADDRESS')}</label>
              <Field
                name="address"
                render={({ field }: FieldProps<string>) => (
                  <InputField
                    inputError={errors && errors.address}
                    {...field}
                    placeholder={translateRaw('ADDRESSBOOK_ADDRESS_PLACEHOLDER')}
                  />
                )}
              />
            </AddressFieldset>
            <AddressFieldset>
              <Field
                name="network"
                render={({ field, form }: FieldProps<NetworkId>) => (
                  <SNetworkSelectDropdown
                    network={field.value}
                    onChange={(e) => form.setFieldValue(field.name, e)}
                  />
                )}
              />
            </AddressFieldset>
            <AddressFieldset>
              <label htmlFor="notes">{translateRaw('ADDRESSBOOK_NOTES')}</label>
              <Field
                name="notes"
                render={({ field }: FieldProps<string>) => (
                  <InputField
                    {...field}
                    textarea={true}
                    placeholder={translateRaw('ADDRESSBOOK_NOTES_PLACEHOLDER')}
                  />
                )}
              />
            </AddressFieldset>
            <AddressBookButtons>
              <Button type="button" secondary={true} onClick={toggleFlipped}>
                {translateRaw('ACTION_2')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {translateRaw('ADDRESS_BOOK_TABLE_ADD_ADDRESS')}
              </Button>
            </AddressBookButtons>
          </Form>
        )}
      </Formik>
    </AddToAddressBookPanel>
  );
}
