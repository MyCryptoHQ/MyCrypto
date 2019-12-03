import React, { Component } from 'react';

import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import translate from 'v2/translations';
import { subscribeToMailingList } from 'v2/services/ApiService';

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
              placeholder="Email address"
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
