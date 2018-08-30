import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Option } from 'react-select';

import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { transactionMetaActions } from 'features/transaction';
import { configSelectors } from 'features/config';
import { walletTypes } from 'features/wallet';
import { Query } from 'components/renderCbs';
import { Dropdown } from 'components/ui';

interface DispatchProps {
  setUnitMeta: transactionMetaActions.TSetUnitMeta;
}

interface StateProps {
  unit: string;
  tokens: walletTypes.TokenBalance[];
  allTokens: walletTypes.MergedToken[];
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
const getTokenSymbols = (tokens: (walletTypes.TokenBalance | walletTypes.MergedToken)[]) =>
  tokens.map(t => t.symbol);

function mapStateToProps(state: AppState) {
  return {
    tokens: selectors.getShownTokenBalances(state, true),
    allTokens: selectors.getTokens(state),
    unit: selectors.getUnit(state),
    networkUnit: configSelectors.getNetworkUnit(state)
  };
}

export const UnitDropDown = connect(mapStateToProps, {
  setUnitMeta: transactionMetaActions.setUnitMeta
})(UnitDropdownClass);
