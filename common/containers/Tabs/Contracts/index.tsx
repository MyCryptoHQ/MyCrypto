import React, { Component } from 'react';
import { Interact } from './components/Interact';
import { Deploy } from './components/Deploy';
import './index.scss';
import TabSection from 'containers/TabSection';
import SubTabs, { Tab } from 'components/SubTabs';

interface State {
  activeTab: string;
}

interface Props {
  location: any;
}

export default class Contracts extends Component<Props, State> {
  public render() {
    const { location } = this.props;
    const activeTab = location.pathname.split('/')[2];

    const tabs: Tab[] = [
      {
        path: 'interact',
        name: 'Contract Interact',
        render() {
          return (
            <main className="Tab-content-pane" role="main">
              <Interact />
            </main>
          );
        }
      },
      {
        path: 'deploy',
        name: 'Deploy Contract',
        render() {
          return (
            <main className="Tab-content-pane" role="main">
              <Deploy />
            </main>
          );
        }
      }
    ];

    return (
      <TabSection>
        <section className="Tab-content Contracts">
          <SubTabs root="contract" tabs={tabs} activeTab={activeTab} />
        </section>
      </TabSection>
    );
  }
}
