import React from 'react';
import styled from 'styled-components';
import { Address } from '@mycrypto/ui';

import translate from 'translations';
import { truncate } from 'v2/libs';
import { Currency, Divider, Dropdown } from 'v2/components';
import { isValidETHAddress } from 'libs/validators';

interface AccountSummaryProps {
  address:string;
  label:string;
  balance:string;
}

const SAccountWrapper = styled('div')`
  display: flex;
  padding: 16px 15px 16px 19px;
  flex-direction: column;
  & > div {
    line-height: 1.2;
    color: var(--greyish-brown);
  }
`
const SCurrency = styled(Currency)`
  margin-left: 58px;
`

function AccountSummary({
  address,
  label,
  balance,
  ...props
}:AccountSummaryProps) {
  return (
    <SAccountWrapper {...props}>
      <Address
        title={label}
        truncate={truncate}
        address={address}
      />
      <SCurrency
        amount={balance}
        symbol={'ETH'}
        decimals={4}
        icon={true}
      />
    </SAccountWrapper>
  )
}

// Option item displayed in Dropdown menu. Props are passed by react-select Select.
// To know: Select needs to receive a class in order to attach refs https://github.com/JedWatson/react-select/issues/2459
// Since Account summary is using Address which still has the 'copy', we must handle hover ourself.
class AccountOption extends React.PureComponent {
  public state = {
    isFocused: false
  }

  public render() {
    const { option, onSelect } = this.props;
    return (
      <div
        onPointerDown={() => onSelect(option)}
        onPointerEnter={this.handleMouseEnter}
        onPointerLeave={this.handleMouseLeave}>
        <AccountSummary
          style={{
            pointerEvents: 'none',
            backgroundColor: this.state.isFocused ? '#ececec' : 'inherit'
          }}
          label={option.label}
          address={option.address}
          balance={'1000.809300'}
          />
        <Divider padding={'14px'}/>
      </div>
    )
  }

  private handleMouseEnter = () => {
    this.setState({ isFocused: true });
  }
  private handleMouseLeave = () => {
    this.setState({ isFocused: false });
  }

}

function AccountDropdown({ accounts, name, value, onChange }) {
  // @TODO Handle validation
  const isValidSender = (value: any) => {
    return isValidETHAddress(value);
  };

  return (
    <Dropdown
      name={name}
      placeholder={translate('SEND_ASSETS_ACCOUNT_SELECTION_PLACEHOLDER')}
      options={accounts}
      onChange={(option) => onChange(option)}
      optionComponent={AccountOption}
      value={(value && value.address )? value : undefined}
      valueComponent={({ value: { label, address } }) => (
        <AccountSummary
          style={{ pointerEvents: 'none'}}
          label={label}
          address={address}
          balance={'1000.809300'}
        />
      )}
     />
  )
}

export default AccountDropdown;
