declare module 'react-copy-to-clipboard' {
  interface Options {
    debug: boolean;
    message: string;
  }

  interface Props {
    text: string;
    onCopy?(a: string, b: boolean): void;
    options?: Options;
  }

  export class CopyToClipboard extends React.Component<Props> {}
}
