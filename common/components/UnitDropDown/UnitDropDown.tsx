import React, { Component } from 'react';
import { setUnitMeta, TSetUnitMeta, getUnit } from 'redux/transaction';
import { TokenBalance, MergedToken, getShownTokenBalances, getTokens } from 'redux/wallet';
import { Query } from 'components/renderCbs';
import { connect } from 'react-redux';
import { AppState } from 'redux/reducers';
import { getNetworkUnit } from 'redux/config';
import { Option } from 'react-select';
import { Dropdown } from 'components/ui';

interface DispatchProps {
  setUnitMeta: TSetUnitMeta;
}

interface StateProps {
  unit: string;
  tokens: TokenBalance[];
  allTokens: MergedToken[];
  showAllTokens?: boolean;
  networkUnit: string;
}

class UnitDropdownClass extends Component<DispatchProps & StateProps> {
  public render() {
    const { tokens, allTokens, showAllTokens, unit, networkUnit } = this.props;
    const focusedTokens = showAllTokens ? allTokens : tokens;
    const options = [networkUnit, ...getTokenSymbols(focusedTokens)];
    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) => (
          <Dropdown
            options={options}
            value={unit === 'ether' ? networkUnit : unit}
            onChange={this.handleOnChange}
            clearable={false}
            searchable={options.length > 10}
            disabled={!!readOnly}
          />
        )}
      />
    );
  }
  private handleOnChange = (unit: Option<string>) => {
    if (!unit.value) {
      throw Error('No unit value found');
    }
    this.props.setUnitMeta(unit.value);
  };
}
const getTokenSymbols = (tokens: (TokenBalance | MergedToken)[]) => tokens.map(t => t.symbol);

function mapStateToProps(state: AppState) {
  return {
    tokens: getShownTokenBalances(state, true),
    allTokens: getTokens(state),
    unit: getUnit(state),
    networkUnit: getNetworkUnit(state)
  };
}

export const UnitDropDown = connect(mapStateToProps, { setUnitMeta })(UnitDropdownClass);
