import React, { Component } from 'react';
import InteractForm from './components/InteractForm';
import InteractExplorer from './components//InteractExplorer';
import { NetworkContract } from 'config/data';

export default class Interact extends Component {
  public render() {
    // TODO: Use common components for address, abi json
    return (
      <div className="Interact">
        <InteractForm />
        <hr />
        <InteractExplorer />
      </div>
    );
  }
}
