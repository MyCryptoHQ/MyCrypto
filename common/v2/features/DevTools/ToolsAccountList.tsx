import React from 'react';
import { List, Address, Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { AddressBook, ExtendedAccount } from 'v2/types';
import { truncate } from 'v2/utils';
import { getLabelByAccount } from 'v2/services/Store';

const AccountContainer = styled.div`
  display: flex;
  font-size: 18px;
`;

const DeleteButton = styled(Button)`
  align-self: flex-start;
  margin-left: 1em;
`;

export interface AccountListProps {
  accounts: ExtendedAccount[];
  deleteAccount(uuid: string): void;
}

const ToolsAccountList: React.FC<AccountListProps> = props => {
  const { accounts, deleteAccount } = props;
  const list = accounts.map((account: ExtendedAccount, index: number) => {
    const detectedLabel: AddressBook | undefined = getLabelByAccount(account);
    const label = detectedLabel ? detectedLabel.label : 'Unknown Account';
    return (
      <AccountContainer key={index}>
        <Address title={label} address={account.address} truncate={truncate} />
        <DeleteButton onClick={() => deleteAccount(account.uuid)} icon="exit" />
      </AccountContainer>
    );
  });

  return <List group={true}>{list}</List>;
};

export default ToolsAccountList;
