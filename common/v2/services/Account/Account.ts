import * as utils from 'v2/libs';
import { account, extendedAccount } from './types';

export default class AccountServiceBase {
  // TODO: Add duplication/validation handling.
  createAccount = (account: account) => {
    // Handle Account
    const uuid = utils.generateUUID();

    const AccountState = localStorage.getItem('Account') || '{}';
    let parsedAccountState;
    try {
      parsedAccountState = JSON.parse(AccountState);
    } catch (e) {
      parsedAccountState = AccountState;
    }
    const newAccountCache = parsedAccountState;
    newAccountCache[uuid] = account;
    localStorage.setItem('Account', JSON.stringify(newAccountCache));

    // Handle AccountList
    const AccountListState = localStorage.getItem('AccountList') || '[]';
    let parsedAccountListState;
    try {
      parsedAccountListState = JSON.parse(AccountListState);
    } catch {
      parsedAccountListState = AccountListState;
    }
    const newAccountList = [...parsedAccountListState, uuid];
    localStorage.setItem('AccountList', JSON.stringify(newAccountList));
  };

  readAccount = (uuid: string) => {
    const AccountState = localStorage.getItem('Account') || '{}';
    let parsedAccountState;
    try {
      parsedAccountState = JSON.parse(AccountState);
    } catch {
      parsedAccountState = AccountState;
    }
    return parsedAccountState[uuid];
  };

  updateAccount = (uuid: string, account: account) => {
    const AccountState = localStorage.getItem('Account') || '{}';
    let parsedAccountState;
    try {
      parsedAccountState = JSON.parse(AccountState);
    } catch {
      parsedAccountState = AccountState;
    }
    const newAccountCache = Object.assign({}, parsedAccountState[uuid], account);

    localStorage.setItem(`account.${uuid}`, JSON.stringify(newAccountCache));
  };

  deleteAccount = (uuid: string) => {
    // Handle Account
    const AccountState = localStorage.getItem('Account') || '{}';
    let parsedAccountState;
    try {
      parsedAccountState = JSON.parse(AccountState);
    } catch {
      parsedAccountState = AccountState;
    }
    const newAccountCache = delete parsedAccountState[uuid];

    localStorage.setItem('Account', JSON.stringify(newAccountCache));

    // Handle AccountList
    const AccountListState = localStorage.getItem('AccountList') || '[]';
    let parsedAccountListState;
    try {
      parsedAccountListState = JSON.parse(AccountListState);
    } catch {
      parsedAccountListState = AccountListState;
    }
    const findIndex = parsedAccountListState.indexOf(uuid);
    const newAccountList = parsedAccountListState.splice(findIndex, 1);
    localStorage.setItem('AccountList', JSON.stringify(newAccountList));
  };

  readAccounts = (): extendedAccount[] => {
    const AccountListState = localStorage.getItem('AccountList') || '[]';
    const AccountState = localStorage.getItem('Account') || '{}';
    let parsedAccountState: any;
    let parsedAccountListState: any;
    const out: extendedAccount[] = [];
    try {
      parsedAccountState = JSON.parse(AccountState);
    } catch (e) {
      parsedAccountState = AccountState;
    }

    try {
      parsedAccountListState = JSON.parse(AccountListState);
    } catch {
      parsedAccountListState = AccountListState;
    }

    parsedAccountListState.map((uuid: string) => {
      out.push({ ...parsedAccountState[uuid], uuid });
    });
    return out;
  };
}
