import React from 'react';
import GeneralLookupField from './GeneralLookupField';
import { fNetwork } from '@fixtures';
import { Formik, Form } from 'formik';
import { IReceiverAddress } from '@types';

const options = [
  { label: 'Label1', address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' },
  { label: 'Label2', address: '0x5678' }
];

const props = {
  network: fNetwork,
  isValidAddress: false,
  isResolvingName: false,
  setIsResolvingDomain: () => undefined,
  name: 'address',
  placeholder: 'placeholder',
  options,
  value: { display: '', value: '' }
};

const initialFormikValues: { address: IReceiverAddress } = {
  address: {
    display: '',
    value: ''
  }
};

export default { title: 'GeneralLookupField' };

export const defaultState = () => (
  <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
    <Formik
      initialValues={initialFormikValues}
      onSubmit={() => undefined}
      render={({ values }) => (
        <Form>
          <GeneralLookupField {...props} value={values.address} />
        </Form>
      )}
    />
  </div>
);
