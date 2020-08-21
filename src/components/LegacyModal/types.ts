export interface IButton {
  text: string | React.ReactElement<unknown>;
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'link';
  disabled?: boolean;
  onClick?(): void;
}
