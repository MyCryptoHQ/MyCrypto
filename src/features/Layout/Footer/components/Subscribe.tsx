import React, { FC, useCallback, useState } from 'react';

import { subscribeToMailingList } from '@services/ApiService';
import translate, { translateRaw } from '@translations';

const Subscribe: FC = () => {
  const [emailValue, setEmailValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback(
    ({ target: { value: email } }: React.ChangeEvent<HTMLInputElement>) => setEmailValue(email),
    [setEmailValue]
  );

  const subscribe = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      subscribeToMailingList(emailValue).catch(() => setSubmitted(true));
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
