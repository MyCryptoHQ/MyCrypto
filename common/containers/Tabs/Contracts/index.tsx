import React, { Component } from 'react';
import translate from 'translations';
import { Interact } from './components/Interact';
import { Deploy } from './components/Deploy';
import './index.scss';
import { reset, TReset } from 'actions/transaction';
import { resetWallet, TResetWallet } from 'actions/wallet';
import TabSection from 'containers/TabSection';
import SubTabs, { Tab } from 'components/SubTabs';

interface State {
  activeTab: string;
}

interface Props {
  location: any;
}
/*
  public changeTab = activeTab => () => {
    this.props.reset();
    this.props.resetWallet();
    this.setState({ activeTab });
  };
*/
class Contracts extends Component<Props, State> {
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
          <SubTabs root="contracts" tabs={tabs} activeTab={activeTab} subTabProps={null} />
        </section>
      </TabSection>
    );
  }
}

export default connect(null, { reset, resetWallet })(Contracts);
