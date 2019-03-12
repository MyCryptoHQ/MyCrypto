import React from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { Button, Input, Textarea } from '@mycrypto/ui';

import { DashboardPanel } from '../../components';
import './AddToAddressBook.scss';

// Legacy
import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';

const initialValues = {
  label: '',
  address: '',
  notes: ''
};

interface Props {
  toggleFlipped(): void;
}

export default function AddToAddressBook({ toggleFlipped }: Props) {
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
      <div className="AddToAddressBook-form">
        <Formik
          initialValues={initialValues}
          onSubmit={console.log}
          render={() => (
            <Form>
              <fieldset className="AddToAddressBook-form-fieldset">
                <label htmlFor="label">Label</label>
                <Field
                  name="label"
                  render={({ field }: FieldProps<typeof initialValues>) => (
                    <Input {...field} placeholder="Enter Name of Address" />
                  )}
                />
              </fieldset>
              <fieldset className="AddToAddressBook-form-fieldset">
                <label htmlFor="address">Address</label>
                <Field
                  name="address"
                  render={({ field }: FieldProps<typeof initialValues>) => (
                    <Input {...field} placeholder="Enter Your Token Address" />
                  )}
                />
              </fieldset>
              <fieldset className="AddToAddressBook-form-fieldset">
                <label htmlFor="notes">Notes</label>
                <Field
                  name="notes"
                  render={({ field }: FieldProps<typeof initialValues>) => (
                    <Textarea {...field} placeholder="Enter a Note for this Address" />
                  )}
                />
              </fieldset>
            </Form>
          )}
        />
      </div>
      <div className="AddToAddressBook-buttons">
        <Button secondary={true} onClick={toggleFlipped}>
          Cancel
        </Button>
        <Button>Add Address</Button>
      </div>
    </DashboardPanel>
  );
}
