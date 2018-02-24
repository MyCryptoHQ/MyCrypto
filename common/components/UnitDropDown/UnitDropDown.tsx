import React, { Component } from 'react';
import { setUnitMeta, TSetUnitMeta } from 'actions/transaction';
import Dropdown from 'components/ui/Dropdown';
import { TokenBalance, MergedToken, getShownTokenBalances, getTokens } from 'selectors/wallet';
import { Query } from 'components/renderCbs';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getUnit } from 'selectors/transaction';
import { getNetworkConfig } from 'selectors/config';
import { NetworkConfig } from 'types/network';

interface DispatchProps {
  setUnitMeta: TSetUnitMeta;
}

interface StateProps {
  unit: string;
  tokens: TokenBalance[];
  allTokens: MergedToken[];
  showAllTokens?: boolean;
  network: NetworkConfig;
}

class UnitDropdownClass extends Component<DispatchProps & StateProps> {
  public render() {
    const { tokens, allTokens, showAllTokens, unit, network } = this.props;
    const focusedTokens = showAllTokens ? allTokens : tokens;
    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) => (
          <Dropdown
            options={[network.unit, ...getTokenSymbols(focusedTokens)]}
            value={unit === 'ether' ? network.unit : unit}
            onChange={this.handleOnChange}
            searchable={false}
            clearable={false}
            disabled={!!readOnly}
          />
        )}
      />
    );
  }
  private handleOnChange = unit => {
    this.props.setUnitMeta(unit.value);
  };
}
const getTokenSymbols = (tokens: (TokenBalance | MergedToken)[]) => tokens.map(t => t.symbol);

function mapStateToProps(state: AppState) {
  return {
    tokens: getShownTokenBalances(state, true),
    allTokens: getTokens(state),
    unit: getUnit(state),
    network: getNetworkConfig(state)
  };
}

export const UnitDropDown = connect(mapStateToProps, { setUnitMeta })(UnitDropdownClass);
