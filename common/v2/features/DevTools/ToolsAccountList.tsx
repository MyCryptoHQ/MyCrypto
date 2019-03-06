import React from 'react';
import { List, Address, Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { extendedAccount } from 'v2/services/Account';
import { truncate } from 'v2/libs';

const AccountContainer = styled.div`
  display: flex;
  font-size: 18px;
`;

const DeleteButton = styled(Button)`
  align-self: flex-start;
  margin-left: 1em;
`;

const ToolsAccountList = props => {
  const { accounts, deleteAccount } = props;
  const list = accounts.map((account: extendedAccount) => (
    <AccountContainer>
      <Address title={account.label} address={account.address} truncate={truncate} />
      <DeleteButton onClick={() => deleteAccount(account.uuid)} icon="exit" />
    </AccountContainer>
  ));

  return <List group={true}>{list}</List>;
};

export default ToolsAccountList;
