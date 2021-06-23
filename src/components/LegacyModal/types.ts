import { ReactElement } from 'react';

export interface IButton {
  text: string | ReactElement<unknown>;
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'link';
  disabled?: boolean;
  onClick?(): void;
}
