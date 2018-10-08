import React, { Component } from 'react';

import translate from 'translations';
import subscribeToMailingList from 'api/emails';

export default class Subscribe extends Component {
  public state = { email: '' };

  public render() {
    const { email } = this.state;

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
              value={email}
            />
          </section>
          <section className="Subscribe-input-wrapper-button">
            <button type="submit">{translate('NEW_FOOTER_TEXT_5')}</button>
          </section>
        </form>
      </section>
    );
  }

  private handleChange = ({ target: { value: email } }: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ email });

  private subscribe = (e: React.FormEvent<HTMLFormElement>) => {
    const { email } = this.state;

    e.preventDefault();

    subscribeToMailingList(email)
      .then(() => console.info('Yay'))
      .catch(() => console.error('Aw...'));
  };
}
