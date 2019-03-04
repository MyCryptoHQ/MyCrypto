import generateUuid from 'uuid/v4';

interface Account {
  uuid: string;
  label: string;
  address: string;
  network: string;
  localSettings: string;
  assets: string;
  accountType: string;
  transactionHistory: string;
}

interface AccountHash {
  [uuid: string]: Account;
}

interface AccountSettings {
  uuid: string;
  fiatCurrency: string;
  favorite: boolean;
}

interface AccountSettingsHash {
  [uuid: string]: AccountSettings;
}

interface NewAccountConfig {
  label: string;
  address: string;
  network: string;
  accountType: string;
}

export class AccountServiceBase {
  public accountHash: AccountHash = {};
  public allAccounts: string[] = [];

  private accountSettingsHash: AccountSettingsHash = {};

  public createAccount(accountConfig: NewAccountConfig): Account {
    const uuid = generateUuid();

    this.accountHash[uuid] = {
      uuid,
      ...accountConfig,
      localSettings: '',
      assets: '',
      transactionHistory: ''
    };
    this.allAccounts.push(uuid);

    this.accountSettingsHash[uuid] = {
      uuid,
      fiatCurrency: 'USD',
      favorite: false
    };

    return this.accountHash[uuid];
  }

  public readAccount(uuid: string): Account | void {
    return this.accountHash[uuid];
  }

  public updateAccount(uuid: string, accountConfig: Partial<NewAccountConfig>) {
    this.accountHash[uuid] = {
      ...this.accountHash[uuid],
      ...accountConfig
    };
  }

  public deleteAccount(uuid: string) {
    delete this.accountHash[uuid];

    this.allAccounts = this.allAccounts.filter(id => id !== uuid);
  }
}

let instantiated = false;

// tslint:disable-next-line
export default class AccountService extends AccountServiceBase {
  public static instance = new AccountServiceBase();

  constructor() {
    super();

    if (instantiated) {
      throw new Error(`AccountService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }
}
