import { Form, Formik } from 'formik';

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
    <Formik initialValues={initialFormikValues} onSubmit={() => undefined}>
      {({ values }) => (
        <Form>
          <ContractLookupField {...props} value={values.address} />
        </Form>
      )}
    </Formik>
  </div>
);
