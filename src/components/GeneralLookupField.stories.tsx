import { Form, Formik } from 'formik';

import { fNetwork } from '@fixtures';
import { IReceiverAddress } from '@types';

import GeneralLookupField from './GeneralLookupField';

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

export default { title: 'Molecules/GeneralLookupField', component: GeneralLookupField };

export const defaultState = () => {
  return (
    <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
      <Formik initialValues={initialFormikValues} onSubmit={() => undefined}>
        {({ values }) => (
          <Form>
            <GeneralLookupField {...customProps} value={values.address} />
          </Form>
        )}
      </Formik>
    </div>
  );
};
