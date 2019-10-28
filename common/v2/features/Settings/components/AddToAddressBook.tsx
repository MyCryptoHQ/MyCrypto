import React from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Button, Input } from '@mycrypto/ui';
import styled from 'styled-components';

import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';
import { DashboardPanel, NetworkSelectDropdown, InputField } from 'v2/components';
import { AddressBook } from 'v2/types';

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

interface Props {
  toggleFlipped(): void;
  createAddressBooks(values: AddressBook): void;
}

export default function AddToAddressBook({ toggleFlipped, createAddressBooks }: Props) {
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
        initialValues={{
          label: '',
          address: '',
          notes: '',
          network: ''
        }}
        onSubmit={(values: AddressBook, { setSubmitting }) => {
          createAddressBooks(values);
          setSubmitting(false);
          toggleFlipped();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <AddressFieldset>
              <label htmlFor="label">Label</label>
              <Field
                name="label"
                render={({ field }: FieldProps<AddressBook>) => (
                  <Input {...field} placeholder="Enter name of address" />
                )}
              />
            </AddressFieldset>
            <AddressFieldset>
              <label htmlFor="address">Address</label>
              <Field
                name="address"
                render={({ field }: FieldProps<AddressBook>) => (
                  <Input {...field} placeholder="Enter the address" />
                )}
              />
            </AddressFieldset>
            <AddressFieldset>
              <Field
                name="network"
                render={({ field, form }: FieldProps<AddressBook>) => (
                  <NetworkSelectDropdown
                    network={field.value}
                    onChange={e => form.setFieldValue(field.name, e)}
                  />
                )}
              />
            </AddressFieldset>
            <AddressFieldset>
              <label htmlFor="notes">Notes</label>
              <Field
                name="notes"
                render={({ field }: FieldProps<AddressBook>) => (
                  <InputField {...field} textarea={true} placeholder="Enter a note for this address" />
                )}
              />
            </AddressFieldset>
            <AddressBookButtons>
              <Button type="button" secondary={true} onClick={toggleFlipped}>
                Cancel
              </Button>
              <Button type="Submit" disabled={isSubmitting}>
                Add Address
              </Button>
            </AddressBookButtons>
          </Form>
        )}
      </Formik>
    </AddToAddressBookPanel>
  );
}
