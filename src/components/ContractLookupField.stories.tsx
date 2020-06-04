import React from 'react';
import { fNetwork, fContracts } from '@fixtures';
import { Formik, Form } from 'formik';
import { IReceiverAddress } from '@types';
import ContractLookupField from './ContractLookupField';

const props = {
  network: fNetwork,
  isResolvingName: false,
  setIsResolvingDomain: () => undefined,
  name: 'address',
  placeholder: 'placeholder',
  contracts: fContracts,
  value: { display: '', value: '' }
};

const initialFormikValues: { address: IReceiverAddress } = {
  address: {
    display: '',
    value: ''
  }
};

export default { title: 'ContractLookupField' };

export const defaultState = () => (
  <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
    <Formik
      initialValues={initialFormikValues}
      onSubmit={() => undefined}
      render={({ values }) => (
        <Form>
          <ContractLookupField {...props} value={values.address} />
        </Form>
      )}
    />
  </div>
);
