import React from 'react';
import {
  toggleOfflineConfig as dToggleOfflineConfig,
  TToggleOfflineConfig
} from 'actions/config';
import OfflineSymbol from 'components/ui/OfflineSymbol';
import { connect } from 'react-redux';

interface OfflineToggleProps {
  offline: boolean;
  toggleOfflineConfig: TToggleOfflineConfig;
}

class OfflineToggle extends React.Component<OfflineToggleProps, {}> {
  public render() {
    const { toggleOfflineConfig, offline } = this.props;

    return (
      <div className="row text-center">
        <div className="col-md-3">
          <OfflineSymbol offline={offline} size="small" />
        </div>
        <div className="col-md-6">
          <button className="btn-xs btn-info" onClick={toggleOfflineConfig}>
            Go {offline ? 'Online' : 'Offline'}
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    offline: state.config.offline
  };
}

export default connect(mapStateToProps, {
  toggleOfflineConfig: dToggleOfflineConfig
})(OfflineToggle);
