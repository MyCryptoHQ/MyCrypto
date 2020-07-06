import React from 'react';
import GeneralLookupField from './GeneralLookupField';
import { fNetwork } from '@fixtures';
import { Formik, Form } from 'formik';
import { IReceiverAddress } from '@types';

const customProps = {
  network: fNetwork,
  isValidAddress: false,
  isResolvingName: false,
  setIsResolvingDomain: () => undefined,
  name: 'address',
  placeholder: 'placeholder',
  options: [
    { label: 'Label1', address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' },
    { label: 'Label2', address: '0x5678' }
  ],
  value: { display: '', value: '' }
};

const initialFormikValues: { address: IReceiverAddress } = {
  address: {
    display: '',
    value: ''
  }
};

export default { title: 'GeneralLookupField' };

export const defaultState = () => {
  return (
    <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
      <Formik
        initialValues={initialFormikValues}
        onSubmit={() => undefined}
        render={({ values }) => (
          <Form>
            <GeneralLookupField {...customProps} value={values.address} />
          </Form>
        )}
      />
    </div>
  );
};
