import React, { Component } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import TabSection from '../TabSection';
import './PageNotFound.scss';

export default class PageNotFound extends Component<RouteComponentProps<{}>> {
  public render() {
    const content = (
      <p className="PageNotFound-content">
        Meow! Something went wrong and the page you were looking for doesn't yet exist. Try the{' '}
        <Link to="/">home page</Link>.
      </p>
    );
    return (
      <TabSection>
        <section className="Tab-content PageNotFound">
          <div className="Tab-content-pane">
            <h1 className="PageNotFound-header">/ᐠ≗ᆽ≗ᐟ \</h1>
            <main role="main">{content}</main>
          </div>
        </section>
      </TabSection>
    );
  }
}
