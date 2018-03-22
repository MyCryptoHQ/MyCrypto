import React from 'react';
import { connect } from 'react-redux';
import translate from 'translations';
import TabSection from 'containers/TabSection';
import { UnlockHeader } from 'components/ui';
import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
import { RouteComponentProps, Redirect } from 'react-router';
import { UnavailableWallets, SchedulingFields } from 'containers/Tabs/SendTransaction/components';
import { SideBar } from '../SendTransaction/components/SideBar';
import { getNetworkConfig } from 'selectors/config';

const ScheduleMain = () => (
  <React.Fragment>
    <SchedulingFields />
    <UnavailableWallets />
  </React.Fragment>
);

interface StateProps {
  schedulingDisabled: boolean;
  wallet: AppState['wallet']['inst'];
}

type Props = StateProps & RouteComponentProps<{}>;

class Schedule extends React.Component<Props> {
  public render() {
    const { schedulingDisabled, wallet } = this.props;

    if (schedulingDisabled && wallet) {
      return <Redirect to="account/info" />;
    }

    return (
      <TabSection>
        <section className="Tab-content">
          <UnlockHeader title={translate('SCHEDULE_schedule')} showGenerateLink={true} />
          {wallet && (
            <div className="SubTabs row">
              <div className="col-sm-8">
                {wallet.isReadOnly ? <Redirect to="schedule/info" /> : <ScheduleMain />};
              </div>
              <SideBar />
            </div>
          )}
        </section>
      </TabSection>
    );
  }
}

export default connect((state: AppState) => ({
  wallet: getWalletInst(state),
  schedulingDisabled: getNetworkConfig(state).name !== 'Kovan'
}))(Schedule);
