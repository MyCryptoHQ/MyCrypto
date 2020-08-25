import React from 'react';
import { List, Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { Contact, IAccount } from '@types';
import { getLabelByAccount, useContacts } from '@services/Store';
import { Account } from '@components';

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

const ToolsAccountList: React.FC<AccountListProps> = (props) => {
  const { contacts } = useContacts();
  const { accounts, deleteAccount } = props;
  const list = accounts.map((account: IAccount, index: number) => {
    const detectedLabel: Contact | undefined = getLabelByAccount(account, contacts);
    const label = detectedLabel ? detectedLabel.label : 'Unknown Account';
    return (
      <AccountContainer key={index}>
        <Account title={label} address={account.address} truncate={true} />
        <DeleteButton onClick={() => deleteAccount(account)} icon="exit" />
      </AccountContainer>
    );
  });

  return <List group={true}>{list}</List>;
};

export default ToolsAccountList;
