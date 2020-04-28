import React, { useContext } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';
import { DashboardPanel, NetworkSelectDropdown, InputField } from 'v2/components';
import { AddressBook, NetworkId } from 'v2/types';
import { ToastContext } from 'v2/features/Toasts';
import { translateRaw } from 'v2/translations';
import { isValidETHAddress } from 'v2/services/EthService';
import { AddressBookContext } from 'v2/services';
import { DEFAULT_NETWORK } from 'v2/config/constants';

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
          Add Address
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
              <label htmlFor="label">Label</label>
              <Field
                name="label"
                render={({ field }: FieldProps<string>) => (
                  <InputField {...field} placeholder="Enter name of address" />
                )}
              />
            </AddressFieldset>
            <AddressFieldset>
              <label htmlFor="address">Address</label>
              <Field
                name="address"
                render={({ field }: FieldProps<string>) => (
                  <InputField
                    inputError={errors && errors.address}
                    {...field}
                    placeholder="Enter the address"
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
              <label htmlFor="notes">Notes</label>
              <Field
                name="notes"
                render={({ field }: FieldProps<string>) => (
                  <InputField
                    {...field}
                    textarea={true}
                    placeholder="Enter a note for this address"
                  />
                )}
              />
            </AddressFieldset>
            <AddressBookButtons>
              <Button type="button" secondary={true} onClick={toggleFlipped}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Add Address
              </Button>
            </AddressBookButtons>
          </Form>
        )}
      </Formik>
    </AddToAddressBookPanel>
  );
}
