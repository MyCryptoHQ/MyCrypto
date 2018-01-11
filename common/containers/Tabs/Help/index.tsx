import React from 'react';
import translate from 'translations';
import TabSection from 'containers/TabSection';
import { knowledgeBaseURL } from 'config/data';

const Help = () => (
  <TabSection>
    <section className="container" style={{ minHeight: '50%' }}>
      <div className="tab-content">
        <article className="tab-pane help active">
          <h1>{translate('NAV_Help')}</h1>
          <article className="collapse-container">
            <div>
              <ul>
                <li>
                  <h3>
                    <a
                      href="https://www.reddit.com/r/ethereum/comments/47nkoi/psa_check_your_ethaddressorg_wallets_and_any/d0eo45o"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-danger">{translate('HELP_Warning')}</span>
                    </a>
                  </h3>
                </li>
                <li>
                  <h3>
                    This page is deprecated. Please check out our more up-to-date and searchable{' '}
                    <a href={knowledgeBaseURL} target="_blank" rel="noopener noreferrer">
                      Knowledge Base.{' '}
                    </a>
                  </h3>
                </li>
              </ul>
            </div>
          </article>
        </article>
      </div>
    </section>
  </TabSection>
);

export default Help;
