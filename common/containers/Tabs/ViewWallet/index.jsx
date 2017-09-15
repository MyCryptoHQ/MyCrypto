// @flow
import React, { Component } from 'react';
import translate from 'translations';

type Props = {};

export default class ViewWallet extends Component<Props> {
  render() {
    return (
      <section className="container">
        <div className="tab-content">
          <article className="tab-pane active">
            <article className="collapse-container">
              <div>
                <h1>View Wallet Info</h1>
              </div>
              <div>
                <p>
                  {translate('VIEWWALLET_Subtitle')}
                </p>
              </div>
            </article>
          </article>
        </div>
      </section>
    );
  }
}
