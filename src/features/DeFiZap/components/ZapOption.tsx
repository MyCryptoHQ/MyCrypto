import React, { FC } from 'react';

import { Divider } from '@components';
import { OptionProps } from 'react-select';

import { translateRaw } from '@translations';
import { AccountDropdownOptionType } from '@components/AccountDropdown';

const ZapOption: FC<OptionProps<AccountDropdownOptionType>> = (props) => {
  const { data, selectOption } = props;
  const { name, key } = data;

  return (
    <>
      <ZapSummary name={name} keyId={key} onClick={() => selectOption(data)} />
      <Divider padding={'14px'} />
    </>
  );
};

const MemoizedZapOption = React.memo(ZapOption);
export default MemoizedZapOption;

export const ZapSummary = ({
  name,
  keyId,
  onClick
}: {
  name: string;
  keyId: string;
  onClick: any;
}) => {
  return (
    <div onClick={onClick}>
      <p>{name && keyId ? `${name} - ${keyId}` : translateRaw('UNKNOWN')}</p>
    </div>
  );
};
