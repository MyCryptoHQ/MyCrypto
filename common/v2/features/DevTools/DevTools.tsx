import React from 'react';
import { Formik } from 'formik';

import './DevTools.scss';
import AccountServiceBase from 'v2/services/Account/Account';

export default function DevTools() {
  return (
    <div className="DevToolsAccount">
      <div className="DevToolsAccount-Wrapper">
        <div className="Settings-heading">Enter a new Account</div>
        <Formik
          initialValues={{
            address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
            label: 'test1',
            network: 'ETH'
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log('New account add: ' + JSON.stringify(values, null, 4));
            const newAccount = new AccountServiceBase();
            newAccount.createAccount(values);
            setSubmitting(false);
          }}
          /*validate={values => {
            let errors = {};
            if (!values.address) {
              errors['address'] = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.address)
            ) {
              errors['address'] = 'Invalid email address';
            }
            return errors;
          }}*/
        >
          {({
            values,
            //errors,
            //touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              Address:{' '}
              <input
                type="address"
                name="address"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values['address']}
              />
              <br />
              {/*errors.address && touched.address && errors.address*/}
              Label:{' '}
              <input
                type="label"
                name="label"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values['label']}
              />
              <br />
              Network:{' '}
              <input
                type="network"
                name="network"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values['network']}
              />
              <br />
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
