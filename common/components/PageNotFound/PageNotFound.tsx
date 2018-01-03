import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import TabSection from '../../containers/TabSection/index';
import './PageNotFound.scss';

const PageNotFound: React.SFC<RouteComponentProps<{}>> = () => (
  <TabSection>
    <section className="Tab-content PageNotFound">
      <div className="Tab-content-pane">
        <h1 className="PageNotFound-header">/ᐠ≗ᆽ≗ᐟ \</h1>
        <main role="main">
          <p className="PageNotFound-content">
            Meow! Something went wrong and the page you were looking for doesn't yet exist. Try the{' '}
            <Link to="/">home page</Link>.
          </p>
        </main>
      </div>
    </section>
  </TabSection>
);

export default PageNotFound;
