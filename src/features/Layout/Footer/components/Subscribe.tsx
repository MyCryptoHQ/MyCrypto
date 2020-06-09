import React, { FC, useCallback, useState } from 'react';

import { ANALYTICS_CATEGORIES } from '@services';
import translate, { translateRaw } from '@translations';
import { subscribeToMailingList } from '@services/ApiService';
import { useAnalytics } from '@utils';

const Subscribe: FC = () => {
  const [emailValue, setEmailValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const trackSubscribed = useAnalytics({
    category: ANALYTICS_CATEGORIES.FOOTER
  });

  const handleChange = useCallback(
    ({ target: { value: email } }: React.ChangeEvent<HTMLInputElement>) => setEmailValue(email),
    [setEmailValue]
  );

  const subscribe = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      subscribeToMailingList(emailValue).catch(() => setSubmitted(true));

      trackSubscribed({
        actionName: 'Subscribed to MyCrypto'
      });
    },
    [emailValue, setSubmitted]
  );

  return (
    <section className="Subscribe">
      <h2>{translate('NEW_FOOTER_TEXT_3')}</h2>
      <p>{translate('NEW_FOOTER_TEXT_4')}</p>
      <form onSubmit={subscribe} className="Subscribe-input-wrapper">
        <section className="Subscribe-input-wrapper-input">
          <input
            type="email"
            placeholder={translateRaw('EMAIL_ADDRESS_PLACEHOLDER')}
            onChange={handleChange}
            disabled={submitted}
            value={submitted ? '' : emailValue}
          />
        </section>
        <section className="Subscribe-input-wrapper-button">
          <button disabled={submitted} type="submit">
            {translate('NEW_FOOTER_TEXT_5')}
          </button>
        </section>
      </form>
      {submitted && <p style={{ marginTop: '6px' }}>{translate('NEW_FOOTER_TEXT_14')}</p>}

      <p style={{ paddingTop: '1em', fontSize: '70%', fontStyle: 'italic' }}>
        {translate('NEW_FOOTER_TEXT_15')}
      </p>
    </section>
  );
};

export default Subscribe;
