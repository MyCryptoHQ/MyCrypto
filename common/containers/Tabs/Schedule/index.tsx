import React from 'react';
import { connect } from 'react-redux';
import translate from 'translations';
import TabSection from 'containers/TabSection';
import { UnlockHeader } from 'components/ui';
import { getWalletInst } from 'selectors/wallet';
import { AppState } from 'reducers';
import { RouteComponentProps, Redirect } from 'react-router';
import { UnavailableWallets, SchedulingFields } from 'containers/Tabs/SendTransaction/components';
import { isNetworkUnit } from 'selectors/config/wallet';
import { SideBar } from '../SendTransaction/components/SideBar';

const ScheduleMain = () => (
  <React.Fragment>
    <SchedulingFields />
    <UnavailableWallets />
  </React.Fragment>
);

interface StateProps {
  wallet: AppState['wallet']['inst'];
  requestDisabled: boolean;
}

type Props = StateProps & RouteComponentProps<{}>;

class Schedule extends React.Component<Props> {
  public render() {
    const { wallet, match } = this.props;
    const currentPath = match.url;

    return (
      <TabSection>
        <section className="Tab-content">
          <UnlockHeader title={translate('SCHEDULE_schedule')} showGenerateLink={true} />
          {wallet && (
            <div className="SubTabs row">
              <div className="col-sm-8">
                {wallet.isReadOnly ? <Redirect to={`${currentPath}/info`} /> : <ScheduleMain />};
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
  requestDisabled: !isNetworkUnit(state, 'ETH')
}))(Schedule);
