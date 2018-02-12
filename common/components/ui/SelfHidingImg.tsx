import React from 'react';

interface Props {
  src: string;
}

export default class SelfHideImg extends React.Component<Props> {
  public state = {
    errored: false
  };

  public handleError = () => {
    this.setState({ errored: true });
  };

  public render() {
    const { src } = this.props;
    const { errored } = this.state;
    return errored ? null : <img onError={this.handleError} src={src} />;
  }
}
