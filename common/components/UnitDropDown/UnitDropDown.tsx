import React, { Component } from 'react';
import { setUnitMeta, TSetUnitMeta } from 'actions/transaction';
import Dropdown from 'components/ui/Dropdown';
import { withConditional } from 'components/hocs';
import { TokenBalance, MergedToken, getShownTokenBalances, getTokens } from 'selectors/wallet';
import { Query } from 'components/renderCbs';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getUnit } from 'selectors/transaction';
import { getNetworkConfig } from 'selectors/config';

interface DispatchProps {
  setUnitMeta: TSetUnitMeta;
}

interface StateProps {
  unit: string;
  tokens: TokenBalance[];
  allTokens: MergedToken[];
  showAllTokens?: boolean;
  network: AppState['config']['network'];
}

const StringDropdown = Dropdown as new () => Dropdown<string>;
const ConditionalStringDropDown = withConditional(StringDropdown);

class UnitDropdownClass extends Component<DispatchProps & StateProps> {
  public render() {
    const { tokens, allTokens, showAllTokens, unit, network } = this.props;
    const focusedTokens = showAllTokens ? allTokens : tokens;
    return (
      <div className="input-group-btn">
        <Query
          params={['readOnly']}
          withQuery={({ readOnly }) => (
            <ConditionalStringDropDown
              options={[network.unit, ...getTokenSymbols(focusedTokens)]}
              value={unit === 'ether' ? network.unit : unit}
              condition={!readOnly}
              conditionalProps={{
                onChange: this.handleOnChange
              }}
              ariaLabel={'dropdown'}
            />
          )}
        />
      </div>
    );
  }
  private handleOnChange = (unit: string) => {
    this.props.setUnitMeta(unit);
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
