import React, { Component, createContext } from 'react';
import toast from 'toasted-notes';

import { default as ToastComponent } from './components/Toast';
import { toastConfigs, ToastTemplates } from './constants';

interface Templates {
  [key: string]: any;
}

interface ProviderState {
  toastTemplates: Templates;
  displayToast(templateName: string, templateData?: object): void;
}

export const ToastContext = createContext({} as ProviderState);

export class ToastProvider extends Component {
  public state: ProviderState = {
    toastTemplates: ToastTemplates,
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
