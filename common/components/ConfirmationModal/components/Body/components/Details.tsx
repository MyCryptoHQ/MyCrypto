import React, { Component } from 'react';
import Code from 'components/ui/Code';
import './Details.scss';
import { SerializedTransaction } from 'components/renderCbs';
import { AppState } from 'reducers';
import { getNodeConfig } from 'selectors/config';
import { connect } from 'react-redux';
import { NodeConfig } from 'types/node';
import translate from 'translations';
import { Input } from 'components/ui';

interface StateProps {
  node: NodeConfig;
}

class DetailsClass extends Component<StateProps> {
  public render() {
    const { node: { network, service } } = this.props;
    return (
      <div className="tx-modal-details">
        <label className="input-group">
          <div className="input-group-header">Network</div>
          <Input readOnly={true} value={`${network} network - provided by ${service}`} />
        </label>

        <SerializedTransaction
          withSerializedTransaction={(_, fields) => {
            return (
              <React.Fragment>
                <label className="input-group">
                  <div className="input-group-header">{translate('SEND_raw')}</div>
                  <Code>{JSON.stringify({ ...fields }, null, 2)} </Code>
                </label>
                <label className="input-group">
                  <div className="input-group-header">{translate('SEND_signed')}</div>
                  <Code>{'0x' + _} </Code>
                </label>
              </React.Fragment>
            );
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({ node: getNodeConfig(state) });

export const Details = connect(mapStateToProps)(DetailsClass);
