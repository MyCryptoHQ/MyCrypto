import React, { useContext } from 'react';
import { List, Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { AddressBook, IAccount } from 'v2/types';
import { truncate } from 'v2/utils';
import { getLabelByAccount, AddressBookContext } from 'v2/services/Store';
import { Account } from 'v2/components';

const AccountContainer = styled.div`
  display: flex;
  font-size: 18px;
`;

const DeleteButton = styled(Button)`
  align-self: flex-start;
  margin-left: 1em;
`;

export interface AccountListProps {
  accounts: IAccount[];
  deleteAccount(account: IAccount): void;
}

const ToolsAccountList: React.FC<AccountListProps> = props => {
  const { addressBook } = useContext(AddressBookContext);
  const { accounts, deleteAccount } = props;
  const list = accounts.map((account: IAccount, index: number) => {
    const detectedLabel: AddressBook | undefined = getLabelByAccount(account, addressBook);
    const label = detectedLabel ? detectedLabel.label : 'Unknown Account';
    return (
      <AccountContainer key={index}>
        <Account title={label} address={account.address} truncate={truncate} />
        <DeleteButton onClick={() => deleteAccount(account)} icon="exit" />
      </AccountContainer>
    );
  });

  return <List group={true}>{list}</List>;
};

export default ToolsAccountList;
