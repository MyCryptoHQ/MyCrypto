import React, { Component } from 'react';
import Code from 'components/ui/Code';
import './Details.scss';
import { SerializedTransaction } from 'components/renderCbs';
import { AppState } from 'reducers';
import { getNodeConfig } from 'selectors/config';
import { NodeConfig } from 'config';
import { connect } from 'react-redux';
import { TokenValue } from 'libs/units';

interface StateProps {
  node: NodeConfig;
}

class DetailsClass extends Component<StateProps> {
  public render() {
    const { node: { network, service } } = this.props;
    return (
      <div className="tx-modal-details">
        <p className="tx-modal-details-network-info">
          Interacting with the {network} network provided by {service}
        </p>

        <SerializedTransaction
          withSerializedTransaction={(_, fields) => {
            const { chainId, data, to, ...convertRestToBase10 } = fields;
            const base10Fields = Object.entries(convertRestToBase10).reduce(
              (convertedFields, [currName, currValue]) => ({
                ...convertedFields,
                [currName]: TokenValue(currValue).toString()
              }),
              {} as typeof convertRestToBase10
            );
            return <Code>{JSON.stringify({ chainId, data, to, ...base10Fields }, null, 2)} </Code>;
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({ node: getNodeConfig(state) });

export const Details = connect(mapStateToProps)(DetailsClass);
