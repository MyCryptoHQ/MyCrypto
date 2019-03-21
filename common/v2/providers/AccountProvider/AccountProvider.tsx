import AccountServiceBase from 'v2/services/Account/Account';
import { serviceProvider } from 'v2/providers/serviceProvider';

export const AccountProvider = serviceProvider(new AccountServiceBase());
