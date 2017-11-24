import React from 'react';
import {
  NonceField,
  AddressField,
  AmountField,
  DataField,
  GasField,
  SendEverything,
  UnitDropDown,
  CurrentCustomMessage,
  GenerateTransaction
} from './components';
import {
  Offline,
  OnlyUnlocked,
  Wallet,
  WhenQueryExists
} from 'components/renderCbs';
import translate from 'translations';
import { Aux } from 'components/ui';

const content = (
  <main className="col-sm-8">
    <div className="Tab-content-pane">
      <AddressField />
      <div className="row form-group">
        <div className="col-xs-11">
          <div className="input-group">
            <AmountField />
            <UnitDropDown />
          </div>
          <SendEverything />
        </div>
        <div className="col-xs-1" />
      </div>

      <div className="row form-group">
        <div className="col-xs-11">
          <GasField />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-xs-11">
          <NonceField />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-xs-11">
          <DataField />
        </div>
      </div>
      <CurrentCustomMessage />
      <div className="row form-group">
        <div className="col-xs-12 clearfix">
          <GenerateTransaction />
        </div>
      </div>
    </div>
  </main>
);

const QueryWarning: React.SFC<{}> = () => (
  <WhenQueryExists
    whenQueryExists={
      <div className="alert alert-info">
        <p>{translate('WARN_Send_Link')}</p>
      </div>
    }
  />
);

interface Props {
  offline: boolean;
  forceOffline: boolean;
  isWeb3Wallet: boolean;
}

const Fields: React.SFC<Props> = ({ forceOffline, isWeb3Wallet, offline }) =>
  !(offline || (forceOffline && isWeb3Wallet)) ? content : null;

const Wrapped: React.SFC<{}> = () => (
  <OnlyUnlocked
    whenUnlocked={
      <Offline
        withOffline={({ forceOffline, offline }) => (
          <Wallet
            withWallet={({ isWeb3Wallet }) => (
              <Aux>
                <QueryWarning />
                <Fields
                  offline={offline}
                  forceOffline={forceOffline}
                  isWeb3Wallet={isWeb3Wallet}
                />
              </Aux>
            )}
          />
        )}
      />
    }
  />
);

export { Wrapped as Fields };
