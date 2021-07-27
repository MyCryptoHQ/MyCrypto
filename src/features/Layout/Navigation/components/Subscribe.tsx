import { useState } from 'react';

import { Formik } from 'formik';
import { object, string } from 'yup';

import { Body, Box, Button, Input, Text } from '@components';
import { subscribeToMailingList } from '@services';
import { useAnalytics } from '@services/Analytics';
import { SPACING } from '@theme';
import translate, { translateRaw } from '@translations';

interface FormValues {
  email: string;
}

const initialFormikValues: FormValues = {
  email: ''
};

export const Subscribe = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { track } = useAnalytics();

  const subscribe = (formValues: FormValues) => {
    subscribeToMailingList(formValues.email).then(() => setSubmitted(true));
    track({ action: 'Newsletter subscription' });
  };

  const Schema = object().shape({
    email: string().email(translateRaw('EMAIL_NOT_VALID')).required(translateRaw('REQUIRED'))
  });

  return (
    <Box>
      <Body color="WHITE">{translateRaw('NAVIGATION_SUBSCRIBE_TO_MYC')}</Body>
      <Formik
        initialValues={initialFormikValues}
        onSubmit={(values) => subscribe(values)}
        validationSchema={Schema}
      >
        {({ errors, touched, handleChange, handleBlur, values, isSubmitting, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box variant="rowAlign">
              <Input
                style={{ marginBottom: 0, borderRadius: '2px 0 0 2px' }}
                placeholder={translateRaw('YOUR_EMAIL')}
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={!errors.email}
              />
              <Button
                style={{ height: '48px', width: '105px', borderRadius: '0 2px 2px 0' }}
                disabled={isSubmitting}
                type="submit"
              >
                {translateRaw('NEW_FOOTER_TEXT_5')}
              </Button>
            </Box>
            <Text fontSize={5} color="WHITE" mt={SPACING.XS}>
              {translate('NEW_FOOTER_TEXT_15')}
            </Text>
            <Box height="15px">
              <Text fontSize={0} mb={0} color={submitted ? 'WHITE' : 'RED'}>
                {errors && touched.email && !submitted && errors.email}
                {submitted && translateRaw('NEW_FOOTER_TEXT_14')}
              </Text>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};
