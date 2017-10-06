import React from 'react';
import {
  forceOfflineConfig as dForceOfflineConfig,
  TForceOfflineConfig
} from 'actions/config';
import OfflineSymbol from 'components/ui/OfflineSymbol';
import { connect } from 'react-redux';

type sizeType = 'small' | 'medium' | 'large';

interface OfflineToggleProps {
  offline: boolean;
  forceOffline: boolean;
  forceOfflineConfig: TForceOfflineConfig;
  size?: sizeType;
}

class OfflineToggle extends React.Component<OfflineToggleProps, {}> {
  public render() {
    const { forceOfflineConfig, offline, forceOffline, size } = this.props;

    return (
      <div>
        {!offline ? (
          <div className="row text-center">
            <div className="col-md-3">
              <OfflineSymbol offline={offline || forceOffline} size={size} />
            </div>
            <div className="col-md-6">
              <button className="btn-xs btn-info" onClick={forceOfflineConfig}>
                {forceOffline ? 'Stop Forced Offline' : 'Force Offline'}
              </button>
            </div>
          </div>
        ) : (
          <h5>You are currently offline.</h5>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    offline: state.config.offline,
    forceOffline: state.config.forceOffline
  };
}

export default connect(mapStateToProps, {
  forceOfflineConfig: dForceOfflineConfig
})(OfflineToggle);
