import React, { useState } from 'react';
import { Formik, Form } from 'formik';

import { noOp } from '@utils';

import MembershipDropdown, { MembershipOption, TMembershipOption } from './MembershipDropdown';
import { MEMBERSHIP_CONFIG } from '../config';

export default { title: 'MembershipDropdown' };

const initialForm: { name: string; value: TMembershipOption } = {
  name: '',
  value: {} as TMembershipOption
};
export const Dropdown = () => {
  const [formValues, setFormValues] = useState(initialForm);

  return (
    <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
      <Formik
        initialValues={formValues}
        onSubmit={noOp}
        render={({ values }) => (
          <Form>
            <MembershipDropdown
              {...values}
              onSelect={(option) => setFormValues({ name: '', value: option })}
            />
          </Form>
        )}
      />
      <pre>{JSON.stringify(formValues)}</pre>
    </div>
  );
};

export const DropdownItem = () => {
  const option = Object.assign(
    {},
    { label: MEMBERSHIP_CONFIG.onemonth.title, value: MEMBERSHIP_CONFIG.onemonth }
  );
  return (
    <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
      <MembershipOption option={option} />
    </div>
  );
};
