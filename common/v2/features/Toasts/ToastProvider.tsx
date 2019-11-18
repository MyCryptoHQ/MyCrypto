import React, { Component, createContext } from 'react';
import toast from 'toasted-notes';

import { IToast } from 'v2/types';
import { default as ToastComponent } from './components/Toast';
import { PositionsType } from 'toasted-notes/lib/Message';

export interface ToastDisplayOptions extends IToast {
  position: PositionsType;
}

export interface ProviderState {
  displayToast({ header, message, type, position }: ToastDisplayOptions): void;
}

export const ToastContext = createContext({} as ProviderState);

export class ToastProvider extends Component {
  public state: ProviderState = {
    displayToast: ({ header, message, type, position }) =>
      this.displayToast({ header, message, type, position })
  };

  public render() {
    const { children } = this.props;
    return <ToastContext.Provider value={this.state}>{children}</ToastContext.Provider>;
  }

  private displayToast = ({ header, message, type, position }: ToastDisplayOptions) => {
    toast.notify(
      ({ onClose }) => <ToastComponent toast={{ header, message, type }} onClose={onClose} />,
      { position }
    );
  };
}
