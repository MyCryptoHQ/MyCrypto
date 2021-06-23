import toast from 'toasted-notes';

import { default as ToastComponent } from './components/Toast';
import { toastConfigs, ToastTemplates } from './constants';

export function useToasts() {
  const displayToast = (templateName: string, templateData?: TObject) => {
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

  return {
    toastTemplates: ToastTemplates,
    displayToast
  };
}
