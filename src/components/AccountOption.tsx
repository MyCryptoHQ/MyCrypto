import React, { FC } from 'react';
import { OptionProps } from 'react-select';

import { AccountSummary, Divider } from '@components';
import { AccountDropdownOptionType } from '@components/AccountDropdown';

const AccountOption: FC<OptionProps<AccountDropdownOptionType>> = (props) => {
  const { data, selectOption } = props;
  const { address, balance, assetUUID, assetSymbol, label } = data;

  return (
    <>
      <AccountSummary
        address={address}
        balance={balance}
        uuid={assetUUID}
        assetSymbol={assetSymbol}
        label={label}
        onClick={() => selectOption(data)}
      />
      <Divider padding={'14px'} />
    </>
  );
};

const MemoizedAccountOption = React.memo(AccountOption);
export default MemoizedAccountOption;
