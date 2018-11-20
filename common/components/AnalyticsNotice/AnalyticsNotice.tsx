import React from 'react';

import translate from 'translations';
import milkAndCookie from 'assets/images/milk-cookie.svg';
import './AnalyticsNotice.scss';

export default function AnalyticsNotice() {
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
          <button className="btn btn-primary">{translate('ANALYTICS_NOTICE_3')}</button>
        </section>
      </section>
    </section>
  );
}
