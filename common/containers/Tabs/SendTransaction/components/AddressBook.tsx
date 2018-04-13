import React from 'react';
import { IWallet } from 'libs/wallet';
import { AddressField } from 'components';
import { Input } from 'components/ui';

interface Props {
  wallet: IWallet;
}

export default class AddressBook extends React.Component<Props> {
  public render() {
    return (
      <div className="AddressBook">
        <div className="Tab-content-pane">
          <div className="row form-group">
            <div className="col-sm-12">
              <AddressField />
            </div>
            <div className="col-sm-12">
              <label>Label</label>
              <Input />
            </div>
            <div className="col-xs-12">
              <button className="btn btn-primary pull-right">
                <i className="fa fa-plus" /> Add Entry
              </button>
            </div>
          </div>
        </div>
        <div className="Tab-content-pane">
          <p>Table</p>
        </div>
      </div>
    );
  }
}
