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
    analytics: true
  };

  public render() {
    const { analytics } = this.state;

    const image = <img src={milkAndCookie} alt="Milk and cookies" />;
    const text = (
      <React.Fragment>
        <h2>{translate('ANALYTICS_NOTICE_1')}</h2>
        <p>{translate('ANALYTICS_NOTICE_2')}</p>
      </React.Fragment>
    );

    return (
      <section className="AnalyticsNotice-wrapper">
        <section className="AnalyticsNotice">
          <div className="only-mobile">
            <div className="AnalyticsNotice-inner-wrapper">
              <section className="AnalyticsNotice-image">{image}</section>
              <section className="AnalyticsNotice-text">{text}</section>
            </div>
          </div>
          <section className="AnalyticsNotice-image only-desktop">
            <img src={milkAndCookie} alt="Milk and cookies" />
          </section>
          <section className="AnalyticsNotice-text only-desktop">
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
                  checked={true}
                  disabled={true}
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
    const { analytics } = this.state;

    setAcknowledgement({ basic: true, analytics });
  };
}
