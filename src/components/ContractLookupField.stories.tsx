import React from 'react';

import { Form, Formik } from 'formik';
import { ProvidersWrapper } from 'test-utils';

import { fContracts, fNetwork } from '@fixtures';
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

export default { title: 'Molecules/ContractLookupField', component: ContractLookupField };

export const defaultState = () => (
  <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
    <ProvidersWrapper>
      <Formik initialValues={initialFormikValues} onSubmit={() => undefined}>
        {({ values }) => (
          <Form>
            <ContractLookupField {...props} value={values.address} />
          </Form>
        )}
      </Formik>
    </ProvidersWrapper>
  </div>
);
