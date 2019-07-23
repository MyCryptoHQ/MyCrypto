import React from 'react';
import { OptionComponentProps } from 'react-select';

import { AccountSummary, Divider } from 'v2/components';

const AccountOption = (props: OptionComponentProps) => {
  const { option, onSelect } = props;

  return (
    <>
      <AccountSummary
        address={option.address}
        balance={option.balance}
        label={option.label}
        onClick={() => onSelect!(option, null)} // Since it's a custom Dropdown we know onSelect is defined
      />
      <Divider padding={'14px'} />
    </>
  );
};

const MemoizedAccountOption = React.memo(AccountOption);

export default MemoizedAccountOption;
