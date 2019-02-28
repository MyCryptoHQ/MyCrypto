import React, { Component } from 'react';

interface State {}

export const AccountContext = React.createContext();

export default class AccountsProvider extends Component {
  public state: State = {};
}
