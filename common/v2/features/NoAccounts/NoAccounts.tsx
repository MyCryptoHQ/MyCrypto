import React, { Component } from 'react';
//import styled from 'styled-components';
import { Layout } from 'v2/features';

export default class NoAccounts extends Component {
  public render() {
    return (
      <Layout>
        <div>You Have no accounts! please add one</div>
      </Layout>
    );
  }
}
