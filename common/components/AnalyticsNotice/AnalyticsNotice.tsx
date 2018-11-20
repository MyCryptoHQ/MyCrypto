import React, { Component } from 'react';

import translate from 'translations';
import { AnalyticsAcknowledgement } from 'providers';
import milkAndCookie from 'assets/images/milk-cookie.svg';
import './AnalyticsNotice.scss';

interface Props {
  setAcknowledgement(options: AnalyticsAcknowledgement): void;
}

export default class AnalyticsNotice extends Component<Props> {
  public state = {
    basic: true,
    analytics: true
  };

  public render() {
    const { basic, analytics } = this.state;

    return (
      <section className="AnalyticsNotice-wrapper">
        <section className="AnalyticsNotice">
          <section className="AnalyticsNotice-image">
            <img src={milkAndCookie} alt="Milk and cookies" />
          </section>
          <section className="AnalyticsNotice-text">
            <h2>{translate('ANALYTICS_NOTICE_1')}</h2>
            <p>{translate('ANALYTICS_NOTICE_2')}</p>
          </section>
          <section className="AnalyticsNotice-controls">
            <section className="AnalyticsNotice-controls-levels">
              <label htmlFor="analytics_basic">
                <input
                  id="analytics_basic"
                  name="basic"
                  type="checkbox"
                  checked={basic}
                  onChange={this.handleCheck}
                />
                {translate('ANALYTICS_NOTICE_4')}
              </label>
              <label htmlFor="analytics_analytics">
                <input
                  id="analytics_analytics"
                  name="analytics"
                  type="checkbox"
                  checked={analytics}
                  onChange={this.handleCheck}
                />
                {translate('ANALYTICS_NOTICE_5')}
              </label>
              {translate('ANALYTICS_NOTICE_6')}
            </section>
            <button className="btn btn-primary" onClick={this.handleAccept}>
              {translate('ANALYTICS_NOTICE_3')}
            </button>
          </section>
        </section>
      </section>
    );
  }

  private handleCheck = ({ target: { name, checked } }: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ [name]: checked });

  private handleAccept = () => {
    const { setAcknowledgement } = this.props;
    const { basic, analytics } = this.state;

    setAcknowledgement({ basic, analytics });
  };
}
