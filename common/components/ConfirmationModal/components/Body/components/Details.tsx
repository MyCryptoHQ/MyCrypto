import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addHexPrefix } from 'ethereumjs-util';

import translate, { translateRaw } from 'translations';
import { NodeConfig } from 'types/node';
import { CodeBlock, Input } from 'components/ui';
import { AppState } from 'features/reducers';
import { configNodesSelectors } from 'features/config';
import { SerializedTransaction } from 'components/renderCbs';
import './Details.scss';

interface StateProps {
  node: NodeConfig;
}

class DetailsClass extends Component<StateProps> {
  public render() {
    const {
      node: { network, service }
    } = this.props;
    return (
      <div className="tx-modal-details">
        <label className="input-group">
          <div className="input-group-header">{translate('NETWORK')}</div>
          <Input
            isValid={true}
            showValidAsPlain={true}
            readOnly={true}
            value={`${translateRaw('NETWORK_2', {
              $network: network
            })} - ${translateRaw('PROVIDED_BY', { $service: service })}`}
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

const mapStateToProps = (state: AppState) => ({ node: configNodesSelectors.getNodeConfig(state) });

export const Details = connect(mapStateToProps)(DetailsClass);
