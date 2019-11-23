import React, { Component, createContext } from 'react';
import toast from 'toasted-notes';

import { default as ToastComponent } from 'v2/components/Toast';
import { toastConfigs } from './constants';

interface ProviderState {
  displayToast(templateName: string, templateData?: object): void;
}

export const ToastContext = createContext({} as ProviderState);

export class ToastProvider extends Component {
  public state: ProviderState = {
    displayToast: (templateName: string, templateData?: object) =>
      this.displayToast(templateName, templateData)
  };

  public render() {
    const { children } = this.props;
    return <ToastContext.Provider value={this.state}>{children}</ToastContext.Provider>;
  }

  private displayToast = (templateName: string, templateData?: object) => {
    const template = toastConfigs[templateName];

    toast.notify(
      ({ onClose }) => (
        <ToastComponent
          toast={{
            header: template.header,
            message: template.message,
            type: template.type,
            templateData
          }}
          onClose={onClose}
        />
      ),
      { position: template.position, duration: template.duration }
    );
  };
}
