import React, { Component } from 'react';

import { AnalyticsService, ANALYTICS_CATEGORIES } from '@services';
import translate, { translateRaw } from '@translations';
import { subscribeToMailingList } from '@services/ApiService';

export default class Subscribe extends Component {
  public state = { email: '', submitted: false };

  public render() {
    const { email, submitted } = this.state;

    return (
      <section className="Subscribe">
        <h2>{translate('NEW_FOOTER_TEXT_3')}</h2>
        <p>{translate('NEW_FOOTER_TEXT_4')}</p>
        <form onSubmit={this.subscribe} className="Subscribe-input-wrapper">
          <section className="Subscribe-input-wrapper-input">
            <input
              type="email"
              placeholder={translateRaw('EMAIL_ADDRESS_PLACEHOLDER')}
              onChange={this.handleChange}
              disabled={submitted}
              value={submitted ? '' : email}
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
  }

  private handleChange = ({ target: { value: email } }: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ email });

  private subscribe = (e: React.FormEvent<HTMLFormElement>) => {
    const { email } = this.state;

    e.preventDefault();

    subscribeToMailingList(email).catch(() => this.setState({ submitted: true }));

    AnalyticsService.instance.track(ANALYTICS_CATEGORIES.FOOTER, 'Subscribed to MyCrypto');
  };
}
