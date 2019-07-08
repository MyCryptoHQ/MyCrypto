// import AddAccount from './AddAccount';
import AddAccountFlow from './AddAccountFlow';

export default [
  {
    name: 'Add Account',
    path: '/add-account/:walletName?',
    exact: true,
    component: AddAccountFlow
  }
];
