import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import { sidebarActions } from 'features/sidebar';
import logo from 'assets/images/logo-mycrypto.svg';
import { LINKSET } from '../constants';
import './MobileHeader.scss';

interface StateProps {
  nodeLabel: ReturnType<typeof configSelectors.getSelectedNodeLabel>;
}

interface DispatchProps {
  toggleSidebar: sidebarActions.TToggleSidebar;
}

type Props = StateProps & DispatchProps;

interface State {
  visibleDropdowns: {
    [dropdown: string]: boolean;
  };
}

class MobileHeader extends Component<Props> {
  public state: State = {
    visibleDropdowns: {
      sendAndReceive: false,
      buyAndExchange: false,
      tools: false
    }
  };

  public render() {
    return <section className="MobileHeader">Header</section>;
  }
}

const mapStateToProps = (state: AppState) => ({
  nodeLabel: configSelectors.getSelectedNodeLabel(state)
});

const mapDispatchToProps = {
  toggleSidebar: sidebarActions.toggleSidebar
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileHeader);
