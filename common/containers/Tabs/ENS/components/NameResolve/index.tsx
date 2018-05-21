import React from 'react';
import { connect } from 'react-redux';

import { NameState } from 'libs/ens';
import { AppState } from 'features/reducers';
import { Spinner } from 'components/ui';
import {
  NameOwned,
  NameAuction,
  NameForbidden,
  NameNotYetAvailable,
  NameOpen,
  NameReveal
} from './components';
import './NameResolve.scss';

type Props = AppState['ens'];

const modeResult = {
  [NameState.Auction]: NameAuction,
  [NameState.Forbidden]: NameForbidden,
  [NameState.NotYetAvailable]: NameNotYetAvailable,
  [NameState.Open]: NameOpen,
  [NameState.Owned]: NameOwned,
  [NameState.Reveal]: NameReveal
};

const NameResolve: React.SFC<Props> = props => {
  const { domainRequests, domainSelector } = props;
  const { currentDomain } = domainSelector;

  if (!currentDomain || !domainRequests[currentDomain] || domainRequests[currentDomain].error) {
    return null;
  }

  const domainData = domainRequests[currentDomain].data || false;
  let content;

  if (domainData) {
    const Component = modeResult[domainData.mode];
    content = <Component {...domainData} />;
  } else {
    content = (
      <div className="NameResolve-loader">
        <Spinner size="x3" />
      </div>
    );
  }

  return <div className="Tab-content-pane">{content}</div>;
};

export default connect((state: AppState): Props => ({ ...state.ens }))(NameResolve);
