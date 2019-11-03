export interface Tab {
  title: string | JSX.Element | undefined;
  onClick(): void;
}
