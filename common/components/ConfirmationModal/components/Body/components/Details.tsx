import React, { Component } from 'react';
import './Details.scss';
import { SerializedTransaction } from 'components/renderCbs';
import { AppState } from 'reducers';
import { getNodeConfig } from 'selectors/config';
import { connect } from 'react-redux';
import { NodeConfig } from 'types/node';
import translate from 'translations';
import { CodeBlock, Input } from 'components/ui';
import { addHexPrefix } from 'ethereumjs-util';

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
          <Input
            isValid={true}
            showValidAsPlain={true}
            readOnly={true}
            value={`${network} network - provided by ${service}`}
          />
        </label>

        <SerializedTransaction
          withSerializedTransaction={(_, fields) => {
            return (
              <React.Fragment>
                <label className="input-group">
                  <div className="input-group-header">{translate('SEND_RAW')}</div>
                  <CodeBlock>{JSON.stringify(fields, null, 2)} </CodeBlock>
                </label>
                <label className="input-group">
                  <div className="input-group-header">{translate('SEND_SIGNED')}</div>
                  <CodeBlock>{addHexPrefix(_)} </CodeBlock>
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
