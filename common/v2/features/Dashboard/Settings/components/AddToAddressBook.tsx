import React from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Button, Input, Textarea } from '@mycrypto/ui';

import { DashboardPanel } from '../../components';
import './AddToAddressBook.scss';

// Legacy
import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';
import { AddressBook } from 'v2/services/AddressBook';

interface Props {
  toggleFlipped(): void;
  createAddressBooks(values: AddressBook): void;
}

export default function AddToAddressBook({ toggleFlipped, createAddressBooks }: Props) {
  return (
    <DashboardPanel
      heading={
        <>
          <Button basic={true} onClick={toggleFlipped} className="AddToAddressBook-back">
            <img src={backArrowIcon} alt="Back" />
          </Button>
          Add Address
        </>
      }
      className="AddToAddressBook"
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
            <fieldset className="AddToAddressBook-form-fieldset">
              <label htmlFor="label">Label</label>
              <Field
                name="label"
                render={({ field }: FieldProps<AddressBook>) => (
                  <Input {...field} placeholder="Enter Name of Address" />
                )}
              />
            </fieldset>
            <fieldset className="AddToAddressBook-form-fieldset">
              <label htmlFor="address">Address</label>
              <Field
                name="address"
                render={({ field }: FieldProps<AddressBook>) => (
                  <Input {...field} placeholder="Enter Your Token Address" />
                )}
              />
            </fieldset>
            <fieldset className="AddToAddressBook-form-fieldset">
              <label htmlFor="notes">Notes</label>
              <Field
                name="notes"
                render={({ field }: FieldProps<AddressBook>) => (
                  <Textarea {...field} placeholder="Enter a Note for this Address" />
                )}
              />
            </fieldset>
            <div className="AddToAddressBook-buttons">
              <Button type="button" secondary={true} onClick={toggleFlipped}>
                Cancel
              </Button>
              <Button type="Submit" disabled={isSubmitting}>
                Add Address
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </DashboardPanel>
  );
}
